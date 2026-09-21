(() => {
  'use strict';

  const D = window.TOEFL_DATA;
  const STORAGE_KEY = 'homemadeToeflProgressV3';
  const ACCESS_KEY = 'homemadeToeflAccessV2';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const shuffle = a => a.map(x => ({x, r: Math.random()})).sort((a,b) => a.r - b.r).map(o => o.x);
  const roundHalf = n => Math.round(n * 2) / 2;

  const defaultSkill = () => ({ done: 0, correct: 0, recent: [] });
  const defaultState = () => ({
    version: 4,
    target: 5.5,
    diagnostic: null,
    stats: { questions: 0, correct: 0, minutes: 0 },
    skills: { reading: defaultSkill(), listening: defaultSkill(), speaking: defaultSkill(), writing: defaultSkill() },
    savedWords: [], streak: 0, activityDates: []
  });

  function mergeState(a, b = {}) {
    const out = { ...a, ...b, version: 4 };
    out.stats = { ...a.stats, ...(b.stats || {}) };
    out.skills = {};
    Object.keys(a.skills).forEach(k => {
      const incoming = b.skills?.[k] || {};
      out.skills[k] = {
        ...a.skills[k],
        ...incoming,
        recent: Array.isArray(incoming.recent) ? incoming.recent.slice(-30).map(Boolean) : []
      };
    });
    out.savedWords = Array.isArray(b.savedWords) ? [...new Set(b.savedWords)] : [];
    out.activityDates = Array.isArray(b.activityDates) ? [...new Set(b.activityDates)].slice(-90) : [];
    return out;
  }

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return raw ? mergeState(defaultState(), raw) : defaultState();
    } catch { return defaultState(); }
  }

  let state = loadState();
  let accent = 'en-US';
  let currentTrap = 0;
  let diagIndex = 0, diagAnswers = [], diagLocked = false;
  let readingTab = 'word', readingIndex = 0, academicQuestion = 0;
  let listeningTab = 'response', listeningIndex = 0;
  let writingTab = 'sentence', writingIndex = 0, buildSelection = [];
  let currentLab = 'hedging', labIndex = 0;
  let savedOnly = false;
  let repeatSetIndex = 0, repeatSentenceIndex = 0;
  let interviewSetIndex = 0, interviewQuestionIndex = 0;
  let mediaRecorder = null, mediaChunks = [], recordingTimer = null, recordingSeconds = 0, activeStream = null, discardRecording = false;
  let activeWriteTimer = null, activeWriteStartedAt = null;

  function saveStateRaw() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
  function markActivity() {
    const d = new Date().toISOString().slice(0,10);
    if (!state.activityDates.includes(d)) state.activityDates.push(d);
    state.activityDates = state.activityDates.slice(-90);
    updateStreak();
    saveStateRaw();
  }
  function updateStreak() {
    const dates = [...new Set(state.activityDates)].sort();
    let streak = 0;
    if (dates.length) {
      const now = new Date();
      const today = now.toISOString().slice(0,10);
      const y = new Date(now); y.setDate(y.getDate()-1);
      const yesterday = y.toISOString().slice(0,10);
      let cursor = dates.includes(today) ? new Date(today) : dates.includes(yesterday) ? new Date(yesterday) : null;
      while (cursor) {
        const key = cursor.toISOString().slice(0,10);
        if (!dates.includes(key)) break;
        streak++;
        cursor.setDate(cursor.getDate()-1);
      }
    }
    state.streak = streak;
  }
  function saveState() { updateStreak(); saveStateRaw(); }
  function recordQuestion(skill, correct) {
    state.stats.questions += 1;
    if (correct) state.stats.correct += 1;
    if (skill && state.skills[skill]) {
      const s = state.skills[skill];
      s.done += 1;
      if (correct) s.correct += 1;
      s.recent.push(!!correct);
      s.recent = s.recent.slice(-30);
    }
    markActivity();
    updateDashboard();
  }
  function addTimedMinutes(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    state.stats.minutes = Number(state.stats.minutes || 0) + minutes;
    markActivity();
    updateDashboard();
  }
  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._x); t._x = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function bandFromPct(p) {
    if (p >= .98) return 6;
    if (p >= .90) return 5.5;
    if (p >= .80) return 5;
    if (p >= .70) return 4.5;
    if (p >= .60) return 4;
    if (p >= .50) return 3.5;
    return 3;
  }
  function cefrFromBand(b) { return b >= 6 ? 'C2' : b >= 5 ? 'C1' : b >= 4 ? 'B2' : 'B1'; }
  function recentAccuracy(skill) {
    const r = state.skills[skill]?.recent || [];
    if (!r.length) return null;
    return r.filter(Boolean).length / r.length;
  }
  function practiceBand(skill) {
    const p = recentAccuracy(skill);
    return p == null ? null : bandFromPct(p);
  }
  function skillBand(skill) {
    const base = state.diagnostic?.skills?.[skill]?.band ?? null;
    const practice = practiceBand(skill);
    const n = state.skills[skill]?.recent?.length || 0;
    if (base == null && practice == null) return null;
    if (base == null) return practice;
    if (practice == null || n < 5) return base;
    const practiceWeight = Math.min(.45, .20 + n * .0125);
    return roundHalf(base * (1 - practiceWeight) + practice * practiceWeight);
  }
  function overallTrainingBand() {
    const vals = ['reading','listening','speaking','writing'].map(skillBand).filter(v => v != null);
    return vals.length ? roundHalf(vals.reduce((a,b)=>a+b,0) / vals.length) : null;
  }

  function clearWriteTimer() {
    if (activeWriteTimer) clearInterval(activeWriteTimer);
    activeWriteTimer = null; activeWriteStartedAt = null;
  }
  function stopRecording(silent = true) {
    if (silent && mediaRecorder && mediaRecorder.state !== 'inactive') discardRecording = true;
    if (recordingTimer) clearInterval(recordingTimer);
    recordingTimer = null;
    try { if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); } catch {}
    if (activeStream) activeStream.getTracks().forEach(t => t.stop());
    activeStream = null;
    if (!silent) toast('Recording stopped.');
  }
  function cleanupTransient() {
    clearWriteTimer();
    if (recordingTimer || activeStream) stopRecording(true);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Navigation
  function navigate(view) {
    cleanupTransient();
    $$('.view').forEach(v => v.classList.toggle('is-active', v.dataset.view === view));
    $$('.main-nav [data-nav]').forEach(b => b.classList.toggle('is-active', b.dataset.nav === view));
    $('#mainNav')?.classList.remove('open');
    $('#menuToggle')?.setAttribute('aria-expanded','false');
    history.replaceState(null,'','#'+view);
    window.scrollTo({top:0,behavior:document.documentElement.classList.contains('reduce-motion')?'auto':'smooth'});
    if (view === 'dashboard') updateDashboard();
    if (view === 'vocabulary') renderVocabulary(savedOnly);
  }
  $$('[data-nav]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.nav)));
  $('#menuToggle')?.addEventListener('click', () => {
    const n = $('#mainNav'); const open = n.classList.toggle('open');
    $('#menuToggle').setAttribute('aria-expanded', open);
  });
  const initial = location.hash.replace('#','');
  if ($(`[data-view="${initial}"]`)) navigate(initial);

  // Accent + speech
  $$('.accent-choice').forEach(b => b.addEventListener('click', () => {
    $$('.accent-choice').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active'); accent = b.dataset.accent;
    toast(`${b.textContent.trim()} voice selected`);
  }));
  function speak(text, rate = .94) {
    if (!('speechSynthesis' in window)) { toast('Text-to-speech is not available on this device.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = accent; u.rate = rate;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v=>v.lang===accent) || voices.find(v=>v.lang.startsWith(accent.slice(0,2)));
    if (preferred) u.voice = preferred;
    speechSynthesis.speak(u);
  }

  // Daily C-level trap (general language control; does not distort one TOEFL skill)
  function renderTrap() {
    const t = D.traps[currentTrap % D.traps.length];
    $('#trapTitle').textContent = t.title; $('#trapPrompt').textContent = t.prompt;
    $('#trapFeedback').textContent = ''; $('#trapFeedback').className = 'feedback';
    const box = $('#trapOptions'); box.innerHTML = ''; box.dataset.locked='0';
    t.options.forEach((o,i) => {
      const b = document.createElement('button'); b.textContent = o;
      b.onclick = () => {
        if (box.dataset.locked === '1') return;
        box.dataset.locked='1';
        [...box.children].forEach((x,j)=>{ if(j===t.answer)x.classList.add('correct'); else if(j===i)x.classList.add('wrong'); x.disabled=true; });
        $('#trapFeedback').textContent=t.explanation;
        $('#trapFeedback').classList.add(i===t.answer?'good':'bad');
        recordQuestion(null, i===t.answer);
      };
      box.appendChild(b);
    });
  }
  $('#nextTrap')?.addEventListener('click',()=>{currentTrap=(currentTrap+1)%D.traps.length;renderTrap();});
  renderTrap();

  // Diagnostic
  $('#startDiagnostic')?.addEventListener('click',()=>{
    diagIndex=0; diagAnswers=[]; diagLocked=false;
    $('#diagIntro').classList.add('hidden'); $('#diagResult').classList.add('hidden'); $('#diagRunner').classList.remove('hidden');
    renderDiag();
  });
  function renderDiag() {
    diagLocked=false;
    const item=D.diagnostic[diagIndex];
    $('#diagSkill').textContent=item.skill.toUpperCase();
    $('#diagCount').textContent=`${diagIndex+1} / ${D.diagnostic.length}`;
    $('#diagProgress').style.width=`${(diagIndex/D.diagnostic.length)*100}%`;
    $('#diagQuestion').textContent=item.q;
    const stim=$('#diagStimulus'); stim.innerHTML='';
    if(item.type==='audio'){
      stim.innerHTML=`<div class="listen-box"><button class="speaker" type="button">▶ Listen</button><span>Listen to the extract, then answer.</span></div>`;
      $('.speaker',stim).onclick=()=>speak(item.audio,.92);
    } else if(item.stimulus) stim.innerHTML=`<div class="stimulus">${esc(item.stimulus)}</div>`;
    const ans=$('#diagAnswers'); ans.innerHTML='';
    item.options.forEach((o,i)=>{
      const b=document.createElement('button'); b.textContent=o; b.onclick=()=>answerDiag(i,b); ans.appendChild(b);
    });
    $('#diagFeedback').textContent='Choose the best answer. Feedback is withheld until the end.';
    $('#diagFeedback').className='feedback';
    $('#diagNext').textContent=diagIndex===D.diagnostic.length-1?'See results →':'Next →';
    $('#diagNext').classList.add('hidden');
  }
  function answerDiag(i) {
    if(diagLocked)return; diagLocked=true;
    const item=D.diagnostic[diagIndex];
    diagAnswers.push({skill:item.skill,ok:i===item.answer,selected:i,itemIndex:diagIndex});
    [...$('#diagAnswers').children].forEach((x,j)=>{ x.disabled=true; if(j===i)x.classList.add('selected-answer'); });
    $('#diagFeedback').textContent='Answer recorded.';
    $('#diagNext').classList.remove('hidden');
  }
  $('#diagNext')?.addEventListener('click',()=>{diagIndex++;if(diagIndex<D.diagnostic.length)renderDiag();else finishDiag();});
  function finishDiag() {
    const by={reading:[],listening:[],speaking:[],writing:[]};
    diagAnswers.forEach(a=>by[a.skill].push(a.ok));
    const skills={};
    Object.keys(by).forEach(k=>{
      const c=by[k].filter(Boolean).length, total=by[k].length, pct=total?c/total:0;
      skills[k]={correct:c,total,pct,band:bandFromPct(pct)};
    });
    const overall=roundHalf(Object.values(skills).reduce((s,x)=>s+x.band,0)/4);
    state.diagnostic={date:new Date().toISOString(),overall,skills};
    state.stats.questions+=D.diagnostic.length; state.stats.correct+=diagAnswers.filter(x=>x.ok).length;
    Object.keys(skills).forEach(k=>{state.skills[k].done+=skills[k].total;state.skills[k].correct+=skills[k].correct;});
    markActivity();
    $('#diagRunner').classList.add('hidden');
    const r=$('#diagResult');r.classList.remove('hidden');
    const missed=diagAnswers.filter(a=>!a.ok);
    r.innerHTML=`<div class="result-hero"><span>Pedagogical baseline</span><strong>${overall.toFixed(1)}</strong><h2>${cefrFromBand(overall)} · ${overall>=5?'C-level range on this diagnostic':'below the C-level range'}</h2><p>This is an internal training estimate, not an ETS score. Speaking and Writing multiple-choice items are language-control proxies; productive performance must be checked in the practice sections.</p></div>
    <div class="result-grid">${Object.entries(skills).map(([k,v])=>`<article class="result-skill"><span>${cap(k)}</span><strong>${v.band.toFixed(1)}</strong><small>${v.correct}/${v.total} correct</small><button class="text-btn" data-go="${k}">Train ${cap(k)} →</button></article>`).join('')}</div>
    ${missed.length?`<details class="card diagnostic-review"><summary><strong>Review the ${missed.length} missed item${missed.length===1?'':'s'}</strong></summary>${missed.map(a=>{const x=D.diagnostic[a.itemIndex];return `<div class="review-item"><span class="tag">${esc(x.skill.toUpperCase())}</span><h3>${esc(x.q)}</h3><p><strong>Correct answer:</strong> ${esc(x.options[x.answer])}</p><p>${esc(x.why)}</p></div>`}).join('')}</details>`:''}
    <div class="cta-row"><button class="btn primary" data-go="dashboard">Open my training dashboard</button><button class="btn secondary" id="retakeDiagnostic">Retake diagnostic</button></div>`;
    $$('[data-go]',r).forEach(b=>b.onclick=()=>navigate(b.dataset.go));
    $('#retakeDiagnostic')?.addEventListener('click',()=>{r.classList.add('hidden');$('#diagIntro').classList.remove('hidden');});
    updateDashboard();
  }

  // Dashboard
  function updateDashboard() {
    const overall=overallTrainingBand();
    $('#overallBand').textContent=overall==null?'—':overall.toFixed(1);
    $('#overallCefr').textContent=overall==null?'Take the diagnostic':`${cefrFromBand(overall)} · internal training estimate`;
    $('#targetBand').value=String(state.target||5.5);
    $('#streakValue').textContent=state.streak||0;
    $('#savedWordsCount').textContent=state.savedWords.length;
    $('#questionsDone').textContent=state.stats.questions||0;
    $('#practiceMinutes').textContent=Number(state.stats.minutes||0).toFixed(state.stats.minutes%1?1:0);
    const skills=['reading','listening','speaking','writing'];
    const grid=$('#skillDashboard'); if(!grid)return;
    grid.innerHTML=skills.map(k=>{
      const b=skillBand(k), d=state.diagnostic?.skills?.[k], p=recentAccuracy(k), n=state.skills[k].recent.length;
      const pct=b==null?0:Math.min(100,Math.max(0,((b-3)/3)*100));
      return `<article class="skill-progress"><div class="skill-progress-head"><h3>${cap(k)}</h3><strong>${b==null?'—':b.toFixed(1)}</strong></div><div class="meter"><span style="width:${pct}%"></span></div><p>${d?`Diagnostic ${d.band.toFixed(1)}`:'No diagnostic baseline'}${p==null?' · no recent scored practice':` · recent accuracy ${Math.round(p*100)}% (${n})`}</p><button class="text-btn" data-go="${k}">Practise ${cap(k)} →</button></article>`;
    }).join('');
    $$('[data-go]',grid).forEach(b=>b.onclick=()=>navigate(b.dataset.go));
    const ranked=skills.map(k=>({k,b:skillBand(k)??0})).sort((a,b)=>a.b-b.b);
    $('#recommendedRoute').innerHTML=ranked.map((x,i)=>`<button class="route-step" data-go="${x.k}"><b>${i+1}</b><span>${cap(x.k)}</span><small>${x.b?x.b.toFixed(1):'not measured'}</small></button>`).join('');
    $$('[data-go]',$('#recommendedRoute')).forEach(b=>b.onclick=()=>navigate(b.dataset.go));
  }
  $('#saveTarget')?.addEventListener('click',()=>{state.target=Number($('#targetBand').value);saveState();toast(`Target saved: ${state.target.toFixed(1)}`);});

  // Reusable MCQ
  function practiceMCQ(title, stimulus, options, answer, why, skill, nextId='nextPractice') {
    return `<article class="practice-card"><span class="tag teal">${esc(title)}</span>${stimulus}<div class="choice-row practice-options">${options.map((o,i)=>`<button data-answer="${i}">${esc(o)}</button>`).join('')}</div><div class="feedback practice-feedback"></div><div class="question-nav"><span></span><button class="btn primary hidden" id="${nextId}">Next →</button></div></article>`;
  }
  function wirePractice(container, {skill=null,onNext=null,nextId='nextPractice'}={}) {
    const buttons=$$('.practice-options button',container), fb=$('.practice-feedback',container), next=$('#'+nextId,container);
    let locked=false;
    buttons.forEach(b=>b.onclick=()=>{
      if(locked)return;locked=true;
      const answer=Number(container.dataset.answer), chosen=Number(b.dataset.answer), ok=chosen===answer;
      buttons.forEach(x=>{x.disabled=true;if(Number(x.dataset.answer)===answer)x.classList.add('correct');else if(x===b)x.classList.add('wrong')});
      fb.textContent=(ok?'✓ ':'✗ ')+(container.dataset.why||'');fb.className='feedback practice-feedback '+(ok?'good':'bad');
      recordQuestion(skill,ok);next?.classList.remove('hidden');
    });
    if(next)next.onclick=()=>onNext?.();
  }

  // Reading
  $$('[data-tabs="reading"] button').forEach(b=>b.onclick=()=>{readingTab=b.dataset.tab;$$('[data-tabs="reading"] button').forEach(x=>x.classList.toggle('is-active',x===b));renderReading();});
  function renderReading(){const w=$('#readingWorkspace'); if(readingTab==='word')renderCtest(w);else if(readingTab==='daily')renderReadingDaily(w);else renderAcademic(w);}
  function parseCtest(text){
    const answers=[]; let idx=0;
    const html=esc(text).replace(/\[\[([A-Za-z’'-]+)\]\]/g,(_,a)=>{const i=idx++;answers.push(a);return `<input class="ctest-input" data-i="${i}" autocomplete="off" spellcheck="false" aria-label="Missing word ending ${i+1}" size="${Math.max(3,a.length)}">`;});
    return {html,answers};
  }
  function renderCtest(w){
    const x=D.reading.word[readingIndex%D.reading.word.length], parsed=parseCtest(x.text);
    w.innerHTML=`<article class="practice-card"><span class="tag teal">COMPLETE THE WORDS · C-TEST</span><h2>${esc(x.title)}</h2><p class="micro-note">Complete all 10 missing word endings. Use grammar, collocation and the argument as a whole.</p><div class="stimulus ctest-passage">${parsed.html}</div><div class="feedback" id="ctestFeedback"></div><div class="cta-row"><button class="btn primary" id="checkCtest">Check all 10</button><button class="btn secondary hidden" id="nextCtest">Next text →</button></div></article>`;
    let checked=false;
    $('#checkCtest').onclick=()=>{
      if(checked)return;checked=true;let correct=0;
      $$('.ctest-input',w).forEach((inp,i)=>{const ok=inp.value.trim().toLowerCase()===parsed.answers[i].toLowerCase();inp.classList.add(ok?'correct':'wrong');inp.disabled=true;if(ok)correct++;else inp.insertAdjacentHTML('afterend',`<span class="ctest-answer">${esc(parsed.answers[i])}</span>`);recordQuestion('reading',ok);});
      $('#ctestFeedback').textContent=`${correct}/10 correct. ${x.why}`;$('#ctestFeedback').className='feedback '+(correct>=8?'good':'bad');
      $('#checkCtest').disabled=true;$('#nextCtest').classList.remove('hidden');
    };
    $('#nextCtest').onclick=()=>{readingIndex++;renderCtest(w)};
  }
  function renderReadingDaily(w){
    const x=D.reading.daily[readingIndex%D.reading.daily.length];
    w.innerHTML=practiceMCQ('READ IN DAILY LIFE',`<div class="stimulus preserve-lines">${esc(x.text)}</div><h2>${esc(x.q)}</h2>`,x.options,x.answer,x.why,'reading');
    w.dataset.answer=x.answer;w.dataset.why=x.why;wirePractice(w,{skill:'reading',onNext:()=>{readingIndex++;renderReadingDaily(w)}});
  }
  function renderAcademic(w){
    const p=D.reading.academic[readingIndex%D.reading.academic.length], q=p.questions[academicQuestion%p.questions.length];
    w.innerHTML=practiceMCQ('READ AN ACADEMIC PASSAGE',`<h2>${esc(p.title)}</h2><div class="stimulus preserve-lines">${esc(p.text)}</div><h3>${esc(q.q)}</h3>`,q.options,q.answer,q.why,'reading');
    w.dataset.answer=q.answer;w.dataset.why=q.why;wirePractice(w,{skill:'reading',onNext:()=>{academicQuestion++;if(academicQuestion>=p.questions.length){academicQuestion=0;readingIndex++;}renderAcademic(w)}});
  }
  renderReading();

  // Listening
  $$('[data-tabs="listening"] button').forEach(b=>b.onclick=()=>{listeningTab=b.dataset.tab;$$('[data-tabs="listening"] button').forEach(x=>x.classList.toggle('is-active',x===b));renderListening();});
  function renderListening(){
    const arr=D.listening[listeningTab],x=arr[listeningIndex%arr.length],labels={response:'CHOOSE A RESPONSE',conversation:'CONVERSATION',announcement:'ANNOUNCEMENT',talk:'ACADEMIC TALK'};
    const w=$('#listeningWorkspace');
    w.innerHTML=practiceMCQ(labels[listeningTab],`<div class="listen-box"><button class="speaker" id="playListening">▶ Listen once</button><span>${listeningTab==='response'?'Focus on the pragmatic relationship.':'Take notes before choosing.'}</span></div><h2>${esc(x.q)}</h2>`,x.options,x.answer,x.why,'listening');
    w.dataset.answer=x.answer;w.dataset.why=x.why;let plays=0;
    $('#playListening').onclick=()=>{plays++;speak(x.audio,listeningTab==='talk'?.90:.93);if(plays>=2)$('#playListening').textContent='▶ Replay';};
    wirePractice(w,{skill:'listening',onNext:()=>{listeningIndex++;renderListening()}});
  }
  renderListening();

  // Speaking — current format: 7 repeats in a scenario; 4 interview questions in a context
  function renderRepeat(){
    const set=D.speaking.repeatSets[repeatSetIndex%D.speaking.repeatSets.length], sentence=set.sentences[repeatSentenceIndex];
    $('#repeatScenario').textContent=set.scenario;
    $('#repeatProgress').textContent=`Sentence ${repeatSentenceIndex+1} / ${set.sentences.length}`;
    $('#repeatSentence').textContent='Transcript hidden. Listen, repeat aloud, then reveal it to self-check.';
    $('#revealRepeat').disabled=true; $('#nextRepeatSentence').disabled=true;
    $('#playRepeat').disabled=false;
  }
  $('#playRepeat')?.addEventListener('click',()=>{const set=D.speaking.repeatSets[repeatSetIndex%D.speaking.repeatSets.length];speak(set.sentences[repeatSentenceIndex],.91);$('#revealRepeat').disabled=false;});
  $('#revealRepeat')?.addEventListener('click',()=>{const set=D.speaking.repeatSets[repeatSetIndex%D.speaking.repeatSets.length];$('#repeatSentence').textContent=set.sentences[repeatSentenceIndex];$('#nextRepeatSentence').disabled=false;});
  $('#nextRepeatSentence')?.addEventListener('click',()=>{const set=D.speaking.repeatSets[repeatSetIndex%D.speaking.repeatSets.length];if(repeatSentenceIndex<set.sentences.length-1)repeatSentenceIndex++;else{repeatSetIndex=(repeatSetIndex+1)%D.speaking.repeatSets.length;repeatSentenceIndex=0;}renderRepeat();});
  $('#newRepeat')?.addEventListener('click',()=>{repeatSetIndex=(repeatSetIndex+1)%D.speaking.repeatSets.length;repeatSentenceIndex=0;renderRepeat();});

  function renderInterview(){
    const set=D.speaking.interviewSets[interviewSetIndex%D.speaking.interviewSets.length];
    $('#interviewScenario').textContent=set.scenario;
    $('#interviewProgress').textContent=`Question ${interviewQuestionIndex+1} / ${set.questions.length}`;
    $('#interviewQuestion').textContent=set.questions[interviewQuestionIndex];
    $('#speakTimer').textContent='00:45';
    $('#recordingPlayback').classList.add('hidden'); $('#recordingPlayback').removeAttribute('src');
    $('#startRecording').disabled=false; $('#stopRecording').classList.add('hidden');
    $('#nextInterviewQ').disabled=true; $('#logSpeakingReview').disabled=true;
    $$('.speaking-check').forEach(x=>x.checked=false);
  }
  $('#playInterview')?.addEventListener('click',()=>{const set=D.speaking.interviewSets[interviewSetIndex%D.speaking.interviewSets.length];speak(set.questions[interviewQuestionIndex],.94);});
  $('#newInterview')?.addEventListener('click',()=>{stopRecording(true);interviewSetIndex=(interviewSetIndex+1)%D.speaking.interviewSets.length;interviewQuestionIndex=0;renderInterview();});
  $('#nextInterviewQ')?.addEventListener('click',()=>{const set=D.speaking.interviewSets[interviewSetIndex%D.speaking.interviewSets.length];interviewQuestionIndex++;if(interviewQuestionIndex>=set.questions.length){interviewSetIndex=(interviewSetIndex+1)%D.speaking.interviewSets.length;interviewQuestionIndex=0;}renderInterview();});
  $('#startRecording')?.addEventListener('click',async()=>{
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){toast('Audio recording is not supported in this browser.');return;}
    try{
      activeStream=await navigator.mediaDevices.getUserMedia({audio:true});
      mediaChunks=[];recordingSeconds=0;discardRecording=false;mediaRecorder=new MediaRecorder(activeStream);
      mediaRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data)};
      mediaRecorder.onstop=()=>{
        if(activeStream)activeStream.getTracks().forEach(t=>t.stop());activeStream=null;
        $('#stopRecording').classList.add('hidden');$('#startRecording').disabled=false;
        if(discardRecording){discardRecording=false;mediaChunks=[];return;}
        if(mediaChunks.length){const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);$('#recordingPlayback').src=url;$('#recordingPlayback').classList.remove('hidden');}
        $('#nextInterviewQ').disabled=false;$('#logSpeakingReview').disabled=false;
        addTimedMinutes(recordingSeconds/60);
      };
      mediaRecorder.start();$('#startRecording').disabled=true;$('#stopRecording').classList.remove('hidden');
      $('#speakTimer').textContent='00:45';
      recordingTimer=setInterval(()=>{recordingSeconds++;const remain=Math.max(0,45-recordingSeconds);$('#speakTimer').textContent=`00:${String(remain).padStart(2,'0')}`;if(remain<=0){clearInterval(recordingTimer);recordingTimer=null;if(mediaRecorder.state!=='inactive')mediaRecorder.stop();}},1000);
    }catch{toast('Microphone permission was not granted.');}
  });
  $('#stopRecording')?.addEventListener('click',()=>{if(recordingTimer)clearInterval(recordingTimer);recordingTimer=null;if(mediaRecorder?.state!=='inactive')mediaRecorder.stop();});
  $('#logSpeakingReview')?.addEventListener('click',()=>{const checks=$$('.speaking-check'),n=checks.filter(x=>x.checked).length;recordQuestion('speaking',n>=5);$('#logSpeakingReview').disabled=true;toast(`Speaking self-check saved: ${n}/6 criteria`);});
  renderRepeat();renderInterview();

  // Writing
  $$('[data-tabs="writing"] button').forEach(b=>b.onclick=()=>{clearWriteTimer();writingTab=b.dataset.tab;$$('[data-tabs="writing"] button').forEach(x=>x.classList.toggle('is-active',x===b));renderWriting();});
  function renderWriting(){const w=$('#writingWorkspace');if(writingTab==='sentence')renderBuild(w);else renderLongWriting(w,writingTab);}
  function normaliseSentence(s){return s.toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();}
  function renderBuild(w){
    const x=D.writing.sentence[writingIndex%D.writing.sentence.length];buildSelection=[];
    const shuffled=shuffle(x.words.map((text,id)=>({text,id})));
    w.innerHTML=`<article class="practice-card"><span class="tag teal">BUILD A SENTENCE</span><h2>Complete the response</h2><div class="stimulus"><strong>Lead-in:</strong> ${esc(x.lead||'Complete the response.')}</div><p>Build the most natural response from all the chunks.</p><div class="build-words">${shuffled.map(o=>`<button class="word-chip" data-id="${o.id}">${esc(o.text)}</button>`).join('')}</div><div class="sentence-build" id="sentenceBuild"></div><div class="feedback" id="buildFeedback"></div><div class="cta-row"><button class="btn secondary" id="clearBuild">Clear</button><button class="btn primary" id="checkBuild">Check</button><button class="btn primary hidden" id="nextBuild">Next →</button></div></article>`;
    $$('.word-chip',w).forEach(b=>b.onclick=()=>{
      const item={id:Number(b.dataset.id),text:b.textContent};buildSelection.push(item);b.disabled=true;
      const c=document.createElement('button');c.className='word-chip';c.textContent=item.text;c.dataset.id=item.id;
      c.onclick=()=>{buildSelection=buildSelection.filter(x=>x.id!==item.id);b.disabled=false;c.remove();};
      $('#sentenceBuild').appendChild(c);
    });
    $('#clearBuild').onclick=()=>renderBuild(w);
    let checked=false;
    $('#checkBuild').onclick=()=>{if(checked)return;checked=true;const built=normaliseSentence(buildSelection.map(x=>x.text).join(' ')),ans=normaliseSentence(x.answer),ok=built===ans;$('#buildFeedback').textContent=ok?'✓ Correct.':`✗ Model: ${x.answer}`;$('#buildFeedback').className='feedback '+(ok?'good':'bad');recordQuestion('writing',ok);$('#checkBuild').disabled=true;$$('.word-chip',w).forEach(b=>b.disabled=true);$('#nextBuild').classList.remove('hidden');};
    $('#nextBuild').onclick=()=>{writingIndex++;renderBuild(w)};
  }
  function renderLongWriting(w,type){
    clearWriteTimer();
    const arr=D.writing[type],x=arr[writingIndex%arr.length],seconds=(type==='email'?7:10)*60;
    let prompt='';
    if(type==='email')prompt=`<p><strong>Situation:</strong> ${esc(x.situation)}</p><div class="score-banner"><span>Recipient: ${esc(x.recipient)}</span><span>Goal: ${esc(x.goal)}</span></div>${x.tasks?.length?`<ul class="task-list">${x.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}`;
    else prompt=`<div class="stimulus"><p>${esc(x.teacher)}</p><p><strong>Student A:</strong> ${esc(x.studentA)}</p><p><strong>Student B:</strong> ${esc(x.studentB)}</p></div><p><strong>Your task:</strong> ${esc(x.prompt)}</p><p class="micro-note">For this trainer, aim for at least 100 words so you have enough space to develop and qualify your contribution.</p>`;
    w.innerHTML=`<article class="practice-card"><span class="tag coral">${type==='email'?'WRITE AN EMAIL':'ACADEMIC DISCUSSION'}</span><h2>${type==='email'?'Write a concise, appropriate email':'Join the discussion'}</h2>${prompt}<div class="timer-display" id="writeTimer">${type==='email'?'07:00':'10:00'}</div><textarea class="writing-area" id="writingArea" placeholder="Write here…"></textarea><div class="word-counter"><span id="wordCount">0</span> words</div><div class="cta-row"><button class="btn secondary" id="startWriteTimer">▶ Start timer</button><button class="btn primary" id="finishWriting">Finish & self-check</button><button class="btn secondary hidden" id="nextWriting">Next prompt</button></div><div id="writingCheck" class="hidden"></div></article>`;
    let remaining=seconds,finished=false;
    const ta=$('#writingArea');ta.oninput=()=>$('#wordCount').textContent=countWords(ta.value);
    $('#startWriteTimer').onclick=()=>{if(activeWriteTimer||finished)return;activeWriteStartedAt=Date.now();$('#startWriteTimer').disabled=true;activeWriteTimer=setInterval(()=>{remaining--;const el=$('#writeTimer');if(el)el.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;if(remaining<=0){clearWriteTimer();toast('Time is up. Finish your current sentence and self-check.');}},1000)};
    $('#finishWriting').onclick=()=>{
      if(finished)return;finished=true;
      const elapsed=activeWriteStartedAt?Math.min(seconds,(Date.now()-activeWriteStartedAt)/1000):0;clearWriteTimer();
      if(elapsed>0)addTimedMinutes(elapsed/60);
      $('#finishWriting').disabled=true;ta.readOnly=true;
      const wc=countWords(ta.value),warning=type==='discussion'&&wc<100?`<p class="feedback bad">You wrote ${wc} words. For this trainer, try to reach at least 100 words while staying relevant and controlled.</p>`:'';
      $('#writingCheck').classList.remove('hidden');
      $('#writingCheck').innerHTML=`${warning}<div class="rubric-grid">${['I answered the exact task.','My ideas are clearly connected.','My register fits the context.','I used precise, varied language.','I qualified claims where needed.','I checked grammar and word forms.'].map(t=>`<label><input type="checkbox" class="writing-check"> ${t}</label>`).join('')}</div><button class="btn secondary" id="logWritingCheck">Save self-check</button><details class="model-box"><summary><strong>Show a possible C-level model</strong></summary><p style="white-space:pre-line">${esc(x.model)}</p></details>`;
      $('#logWritingCheck').onclick=()=>{const n=$$('.writing-check',w).filter(c=>c.checked).length;recordQuestion('writing',n>=5);$('#logWritingCheck').disabled=true;toast(`Writing self-check saved: ${n}/6 criteria`);};
      $('#nextWriting').classList.remove('hidden');
    };
    $('#nextWriting').onclick=()=>{clearWriteTimer();writingIndex++;renderLongWriting(w,type)};
  }
  function countWords(s){return (s.trim().match(/\b[\w’'-]+\b/g)||[]).length;}
  renderWriting();

  // Vocabulary
  function renderVocabulary(filterSaved=savedOnly){
    const q=($('#vocabSearch')?.value||'').toLowerCase().trim();
    const list=D.vocabulary.filter(v=>(!filterSaved||state.savedWords.includes(v[0]))&&(!q||v.join(' ').toLowerCase().includes(q)));
    const grid=$('#vocabGrid');if(!grid)return;
    grid.innerHTML=list.length?list.map(v=>`<article class="vocab-card"><h3>${esc(v[0])}</h3><div class="ipa">${esc(v[1])}</div><p>${esc(v[2])}</p><p class="usage"><strong>Use:</strong> ${esc(v[3])}</p><p><em>${esc(v[4])}</em></p><div class="vocab-actions"><button data-say="${esc(v[0])}">🔊 Listen</button><button data-word="${esc(v[0])}">${state.savedWords.includes(v[0])?'★ Saved':'☆ My Words'}</button></div></article>`).join(''):'<div class="card"><p>No words match this filter.</p></div>';
    $$('[data-say]',grid).forEach(b=>b.onclick=()=>speak(b.dataset.say,.85));
    $$('[data-word]',grid).forEach(b=>b.onclick=()=>toggleWord(b.dataset.word,filterSaved));
  }
  function toggleWord(w,filterSaved){const i=state.savedWords.indexOf(w);if(i>=0)state.savedWords.splice(i,1);else state.savedWords.push(w);saveState();renderVocabulary(filterSaved);updateDashboard();toast(i>=0?'Removed from My Words':'Added to My Words');}
  $('#vocabSearch')?.addEventListener('input',()=>renderVocabulary(savedOnly));
  $('#showSavedWords')?.addEventListener('click',()=>{savedOnly=!savedOnly;$('#showSavedWords').textContent=savedOnly?'📚 All words':'⭐ My Words';renderVocabulary(savedOnly);});
  renderVocabulary();

  // C-Level Lab — general language training, not counted as one TOEFL section
  $$('[data-lab]').forEach(b=>b.onclick=()=>{currentLab=b.dataset.lab;labIndex=0;renderLab(currentLab);$('#labWorkspace').scrollIntoView({behavior:'smooth',block:'center'});});
  function renderLab(key){
    const arr=D.lab[key],x=arr[labIndex%arr.length],names={hedging:'Hedging & caution',nominalisation:'Nominalisation',complex:'Complex sentences',paraphrase:'Paraphrase',stance:'Stance & evaluation',cohesion:'Cohesion'};
    const w=$('#labWorkspace');w.innerHTML=practiceMCQ(names[key],`<h3>${esc(x.q)}</h3>`,x.options,x.answer,x.why,null,'nextLab');w.dataset.answer=x.answer;w.dataset.why=x.why;
    wirePractice(w,{skill:null,nextId:'nextLab',onNext:()=>{labIndex++;renderLab(key);}});
  }

  // Home drill routes
  $$('[data-drill]').forEach(b=>b.onclick=()=>{const d=b.dataset.drill;if(d==='inference'){readingTab='academic';$$('[data-tabs="reading"] button').forEach(x=>x.classList.toggle('is-active',x.dataset.tab==='academic'));navigate('reading');renderReading();}else if(d==='hedging'){navigate('clevel');currentLab='hedging';renderLab('hedging');}else{listeningTab='talk';$$('[data-tabs="listening"] button').forEach(x=>x.classList.toggle('is-active',x.dataset.tab==='talk'));navigate('listening');renderListening();}});

  // Accessibility
  function loadAccess(){let a={};try{a=JSON.parse(localStorage.getItem(ACCESS_KEY)||'{}')}catch{}applyAccess(a);if($('#highContrast'))$('#highContrast').checked=!!a.highContrast;if($('#readableFont'))$('#readableFont').checked=!!a.readableFont;if($('#reduceMotion'))$('#reduceMotion').checked=!!a.reduceMotion;if($('#focusMode'))$('#focusMode').checked=!!a.focusMode;}
  function applyAccess(a){const h=document.documentElement;h.classList.toggle('high-contrast',!!a.highContrast);h.classList.toggle('readable-font',!!a.readableFont);h.classList.toggle('reduce-motion',!!a.reduceMotion);h.classList.toggle('focus-mode',!!a.focusMode);h.classList.remove('font-large','font-xlarge');if(a.font==='large')h.classList.add('font-large');if(a.font==='xlarge')h.classList.add('font-xlarge');}
  function saveAccess(){const a={highContrast:$('#highContrast')?.checked,readableFont:$('#readableFont')?.checked,reduceMotion:$('#reduceMotion')?.checked,focusMode:$('#focusMode')?.checked,font:document.documentElement.classList.contains('font-xlarge')?'xlarge':document.documentElement.classList.contains('font-large')?'large':'normal'};try{localStorage.setItem(ACCESS_KEY,JSON.stringify(a));}catch{}applyAccess(a);}
  $('#accessibilityBtn')?.addEventListener('click',()=>$('#accessibilityModal').classList.remove('hidden'));
  $('#closeAccess')?.addEventListener('click',()=>$('#accessibilityModal').classList.add('hidden'));
  ['highContrast','readableFont','reduceMotion','focusMode'].forEach(id=>{if($('#'+id))$('#'+id).onchange=saveAccess;});
  $$('[data-font]').forEach(b=>b.onclick=()=>{document.documentElement.classList.remove('font-large','font-xlarge');if(b.dataset.font==='large')document.documentElement.classList.add('font-large');if(b.dataset.font==='xlarge')document.documentElement.classList.add('font-xlarge');saveAccess();});
  loadAccess();

  // Export/import
  function exportProgress(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`homemade-toefl-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);}
  async function importProgress(file){if(!file)return;try{const x=JSON.parse(await file.text());state=mergeState(defaultState(),x);saveState();updateDashboard();renderVocabulary();toast('Progress imported');}catch{toast('Invalid progress file');}}
  $('#exportProgress')?.addEventListener('click',exportProgress);$('#exportProgressModal')?.addEventListener('click',exportProgress);
  $('#importProgress')?.addEventListener('change',e=>importProgress(e.target.files[0]));$('#importProgressModal')?.addEventListener('change',e=>importProgress(e.target.files[0]));
  $('#resetProgress')?.addEventListener('click',()=>{if(confirm('Delete all progress saved on this device?')){state=defaultState();saveState();updateDashboard();renderVocabulary();toast('Progress reset');}});
  $('#saveBtn')?.addEventListener('click',()=>$('#saveModal').classList.remove('hidden'));$('#closeSave')?.addEventListener('click',()=>$('#saveModal').classList.add('hidden'));
  $$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal-backdrop').forEach(m=>m.classList.add('hidden'));});

  updateDashboard();
})();
