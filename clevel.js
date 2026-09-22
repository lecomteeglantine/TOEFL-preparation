(() => {
  'use strict';
  const D = window.CLEVEL_DATA;
  if (!D) return;
  const KEY = 'homemadeToeflCLevelV1';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const cap=s=>String(s||'').charAt(0).toUpperCase()+String(s||'').slice(1);
  const emptySkill=()=>({done:0,correct:0,recent:[]});
  const defaults=()=>({version:1,check:null,skills:Object.fromEntries(D.dimensions.map(x=>[x.key,emptySkill()])),missionReviews:[],upgrade:{done:0,correct:0,recent:[]},activity:0});
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
  function merge(raw={}){
    const s=defaults();
    if(raw && typeof raw==='object'){
      s.check=raw.check && typeof raw.check==='object'?raw.check:null;
      D.dimensions.forEach(d=>{
        const x=raw.skills?.[d.key]||{},done=Math.max(0,Number(x.done)||0),correct=Math.min(done,Math.max(0,Number(x.correct)||0));
        s.skills[d.key]={done,correct,recent:Array.isArray(x.recent)?x.recent.slice(-24).map(Boolean):[]};
      });
      s.missionReviews=(Array.isArray(raw.missionReviews)?raw.missionReviews:[]).slice(-60).map(x=>({mission:String(x.mission||''),dimensions:Array.isArray(x.dimensions)?x.dimensions.filter(k=>s.skills[k]):[],score:clamp(x.score,0,6),date:String(x.date||'')}));
      const u=raw.upgrade||{};s.upgrade={done:Math.max(0,Number(u.done)||0),correct:Math.max(0,Number(u.correct)||0),recent:Array.isArray(u.recent)?u.recent.slice(-24).map(Boolean):[]};s.upgrade.correct=Math.min(s.upgrade.done,s.upgrade.correct);
      s.activity=Math.max(0,Number(raw.activity)||0);
    }
    return s;
  }
  function load(){try{return merge(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return defaults()}}
  let state=load();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{} renderProgress();}
  function recentAcc(sk,min=4){const r=sk?.recent||[];return r.length>=min?r.filter(Boolean).length/r.length:(sk?.done?sk.correct/sk.done:null)}
  function reviewAvg(dim){const arr=state.missionReviews.filter(x=>x.dimensions.includes(dim)).slice(-5);return arr.length?arr.reduce((s,x)=>s+x.score,0)/arr.length:null}
  function labelPct(p){if(p==null)return 'Not measured';if(p>=.85)return 'Strong control';if(p>=.7)return 'Developing C-level control';return 'Priority area'}
  function recordObjective(dim,ok){const sk=state.skills[dim];if(!sk)return;sk.done++;if(ok)sk.correct++;sk.recent.push(!!ok);sk.recent=sk.recent.slice(-24);state.activity++;window.TOEFL_APP?.markActivity?.();save();}
  function recordMission(mission,score){const dims=[mission.dimension,mission.secondary].filter(Boolean);state.missionReviews.push({mission:mission.id,dimensions:dims,score,date:new Date().toISOString()});state.missionReviews=state.missionReviews.slice(-60);state.activity++;window.TOEFL_APP?.markActivity?.();save();}
  function renderProgress(){
    const grid=$('#cLevelDashboard');
    if(grid) grid.innerHTML=D.dimensions.map(d=>{const sk=state.skills[d.key],p=recentAcc(sk),rv=reviewAvg(d.key);return `<article class="c-skill-card"><div class="c-skill-head"><span>${d.icon}</span><div><h3>${esc(d.title)}</h3><small>${esc(labelPct(p))}</small></div></div><div class="c-metric-row"><div><strong>${p==null?'—':Math.round(p*100)+'%'}</strong><span>objective</span></div><div><strong>${rv==null?'—':rv.toFixed(1)+'/6'}</strong><span>mission review</span></div></div><div class="meter"><span style="width:${p==null?0:Math.round(p*100)}%"></span></div></article>`}).join('');
    const summary=$('#cLevelSummary');
    if(summary){const ps=D.dimensions.map(d=>recentAcc(state.skills[d.key])).filter(x=>x!=null),avg=ps.length?ps.reduce((a,b)=>a+b,0)/ps.length:null;const reviews=state.missionReviews.slice(-8);const ravg=reviews.length?reviews.reduce((s,x)=>s+x.score,0)/reviews.length:null;summary.innerHTML=`<div><strong>${state.check?.overall!=null?Math.round(state.check.overall*100)+'%':'—'}</strong><span>C-Level Check</span></div><div><strong>${avg==null?'—':Math.round(avg*100)+'%'}</strong><span>recent objective</span></div><div><strong>${ravg==null?'—':ravg.toFixed(1)+'/6'}</strong><span>mission self-review</span></div>`;}
    const main=$('#dashboardCLevel');
    if(main){const ranked=D.dimensions.map(d=>({d,p:recentAcc(state.skills[d.key])})).sort((a,b)=>(a.p??2)-(b.p??2));const measured=ranked.filter(x=>x.p!=null);main.innerHTML=measured.length?ranked.slice(0,4).map(x=>`<button class="c-dashboard-route" data-c-route="${x.d.key}"><span>${x.d.icon} <strong>${esc(x.d.title)}</strong></span><b>${x.p==null?'—':Math.round(x.p*100)+'%'}</b></button>`).join(''):'<p class="empty-state">No Beyond-TOEFL C-level practice yet. Open Reach C Level to build a separate profile.</p>';$$('[data-c-route]',main).forEach(b=>b.onclick=()=>{document.querySelector('.main-nav [data-nav="reachc"]')?.click();setTimeout(()=>{openModule(b.dataset.cRoute);document.querySelector('#cModuleWorkspace')?.scrollIntoView({behavior:'smooth',block:'start'});},0)});}
  }

  // C-Level Check: 3 objective items per dimension, feedback only at end.
  let checkItems=[],checkIndex=0,checkAnswers=[];
  function buildCheck(){return D.dimensions.flatMap(d=>D.modules[d.key].tasks.slice(0,3).map((x,i)=>({...x,dimension:d.key,moduleTitle:d.title,id:`${d.key}-${i}`})));}
  function startCheck(){checkItems=buildCheck();checkIndex=0;checkAnswers=[];$('#cCheckIntro')?.classList.add('hidden');$('#cCheckResult')?.classList.add('hidden');$('#cCheckRunner')?.classList.remove('hidden');renderCheck();}
  function renderCheck(){const x=checkItems[checkIndex],box=$('#cCheckRunner');if(!box)return;box.innerHTML=`<div class="quiz-top"><span class="tag indigo">${esc(D.modules[x.dimension].title)}</span><strong>${checkIndex+1} / ${checkItems.length}</strong></div><div class="progress"><span style="width:${Math.round(checkIndex/checkItems.length*100)}%"></span></div><h2>${esc(x.q)}</h2><div class="choice-row c-check-options">${x.options.map((o,i)=>`<button data-i="${i}">${esc(o)}</button>`).join('')}</div><div class="feedback">Choose the best answer. Feedback is withheld until the end.</div>`;$$('.c-check-options button',box).forEach(b=>b.onclick=()=>{const selected=Number(b.dataset.i);checkAnswers.push({dimension:x.dimension,ok:selected===x.answer,selected,item:x});checkIndex++;if(checkIndex<checkItems.length)renderCheck();else finishCheck();});}
  function finishCheck(){const by={};D.dimensions.forEach(d=>by[d.key]={correct:0,total:0});checkAnswers.forEach(a=>{by[a.dimension].total++;if(a.ok)by[a.dimension].correct++;});Object.values(by).forEach(x=>x.pct=x.total?x.correct/x.total:0);const overall=checkAnswers.filter(x=>x.ok).length/checkAnswers.length;state.check={date:new Date().toISOString(),overall,dimensions:by};state.activity++;window.TOEFL_APP?.markActivity?.();save();$('#cCheckRunner')?.classList.add('hidden');const r=$('#cCheckResult');if(!r)return;r.classList.remove('hidden');const missed=checkAnswers.filter(x=>!x.ok);r.innerHTML=`<div class="c-check-hero"><span>Beyond-TOEFL baseline</span><strong>${Math.round(overall*100)}%</strong><h2>${overall>=.85?'Strong C-level control on this check':overall>=.7?'Developing C-level control':'Clear priorities for C-level development'}</h2><p>This is a training snapshot, not a CEFR certification.</p></div><div class="c-result-grid">${D.dimensions.map(d=>{const x=by[d.key];return `<article><span>${d.icon} ${esc(d.title)}</span><strong>${x.correct}/${x.total}</strong><small>${Math.round(x.pct*100)}%</small></article>`}).join('')}</div>${missed.length?`<details class="card diagnostic-review"><summary><strong>Review ${missed.length} missed distinction${missed.length===1?'':'s'}</strong></summary>${missed.map(a=>`<div class="review-item"><span class="tag">${esc(D.modules[a.dimension].title)}</span><h3>${esc(a.item.q)}</h3><p><strong>Best answer:</strong> ${esc(a.item.options[a.item.answer])}</p><p>${esc(a.item.why)}</p></div>`).join('')}</details>`:''}<div class="cta-row"><button class="btn primary" id="cRetake">Retake check</button><button class="btn secondary" id="cStartWeak">Train my weakest area</button></div>`;$('#cRetake').onclick=()=>{r.classList.add('hidden');$('#cCheckIntro').classList.remove('hidden')};$('#cStartWeak').onclick=()=>{const weak=D.dimensions.map(d=>({k:d.key,p:by[d.key].pct})).sort((a,b)=>a.p-b.p)[0];openModule(weak.k);document.querySelector('#cModuleWorkspace')?.scrollIntoView({behavior:'smooth',block:'start'});};}
  $('#startCCheck')?.addEventListener('click',startCheck);

  // Module drills.
  let moduleKey='precision',moduleIndex=0;
  function openModule(key){if(!D.modules[key])return;moduleKey=key;moduleIndex=0;$$('[data-cmodule]').forEach(b=>b.classList.toggle('is-active',b.dataset.cmodule===key));renderModule();}
  function renderModule(){const mod=D.modules[moduleKey],x=mod.tasks[moduleIndex%mod.tasks.length],w=$('#cModuleWorkspace');if(!w)return;w.innerHTML=`<div class="c-workspace-head"><div><span class="tag teal">${mod.icon} ${esc(mod.title)}</span><h2>${esc(mod.description)}</h2></div><span class="set-progress">${moduleIndex%mod.tasks.length+1} / ${mod.tasks.length}</span></div><article class="practice-card"><h3>${esc(x.q)}</h3><div class="choice-row c-module-options">${x.options.map((o,i)=>`<button data-i="${i}">${esc(o)}</button>`).join('')}</div><div class="feedback c-module-feedback"></div><div class="question-nav"><span></span><button class="btn primary hidden" id="nextCModule">Next →</button></div></article>`;let locked=false;$$('.c-module-options button',w).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const chosen=Number(b.dataset.i),ok=chosen===x.answer;$$('.c-module-options button',w).forEach(z=>{z.disabled=true;if(Number(z.dataset.i)===x.answer)z.classList.add('correct');else if(z===b)z.classList.add('wrong')});const f=$('.c-module-feedback',w);f.textContent=(ok?'✓ ':'✗ ')+x.why;f.className='feedback c-module-feedback '+(ok?'good':'bad');recordObjective(moduleKey,ok);$('#nextCModule').classList.remove('hidden');});$('#nextCModule').onclick=()=>{moduleIndex++;renderModule();};}
  $$('[data-cmodule]').forEach(b=>b.onclick=()=>openModule(b.dataset.cmodule));

  // Upgrade Machine.
  let upgradeIndex=0;
  function renderUpgrade(){const x=D.upgrades[upgradeIndex%D.upgrades.length],w=$('#upgradeWorkspace');if(!w)return;w.innerHTML=`<div class="upgrade-source"><span>B2 source</span><p>${esc(x.source)}</p></div><h3>Which rewrite represents the strongest C-level upgrade?</h3><div class="choice-row upgrade-options">${x.options.map((o,i)=>`<button data-i="${i}">${esc(o)}</button>`).join('')}</div><div class="feedback upgrade-feedback"></div><button class="btn primary hidden" id="nextUpgrade">Next upgrade →</button>`;let locked=false;$$('.upgrade-options button',w).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const chosen=Number(b.dataset.i),ok=chosen===x.answer;$$('.upgrade-options button',w).forEach(z=>{z.disabled=true;if(Number(z.dataset.i)===x.answer)z.classList.add('correct');else if(z===b)z.classList.add('wrong')});const f=$('.upgrade-feedback',w);f.textContent=(ok?'✓ ':'✗ ')+x.why;f.className='feedback upgrade-feedback '+(ok?'good':'bad');state.upgrade.done++;if(ok)state.upgrade.correct++;state.upgrade.recent.push(ok);state.upgrade.recent=state.upgrade.recent.slice(-24);recordObjective(x.dimension,ok);$('#nextUpgrade').classList.remove('hidden');});$('#nextUpgrade').onclick=()=>{upgradeIndex++;renderUpgrade();};}
  renderUpgrade();

  // Missions.
  const spokenMissions=new Set(['expert','devil','diplomat','expertminute']);
  let mission=null,missionPromptIndices={},missionTimer=null,missionRemaining=0,recorder=null,stream=null,chunks=[],audioUrl=null;
  function stopTimer(){if(missionTimer)clearInterval(missionTimer);missionTimer=null;}
  function stopRecorder(discard=false){try{if(recorder&&recorder.state!=='inactive'){recorder._discard=discard;recorder.stop();}}catch{} if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}}
  function cleanupMission(){stopTimer();stopRecorder(true);if(audioUrl){try{URL.revokeObjectURL(audioUrl)}catch{}audioUrl=null;}}
  function openMission(id){cleanupMission();mission=D.missions.find(x=>x.id===id);if(!mission)return;if(missionPromptIndices[id]==null)missionPromptIndices[id]=0;renderMission();$('#missionWorkspace')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function renderMission(){if(!mission)return;const p=mission.prompts[(missionPromptIndices[mission.id]||0)%mission.prompts.length],w=$('#missionWorkspace');w.classList.remove('hidden');const spoken=spokenMissions.has(mission.id);w.innerHTML=`<div class="mission-head"><div><span class="tag coral">${mission.icon} C-LEVEL MISSION</span><h2>${esc(mission.title)}</h2><p>${esc(mission.instruction)}</p></div><button class="text-btn" id="newMissionPrompt">New prompt</button></div><div class="mission-prompt"><h3>${esc(p.topic)}</h3>${(p.sources||[]).map(s=>`<p>${esc(s)}</p>`).join('')}</div><div class="mission-tools"><div class="mission-timer"><strong id="missionClock">05:00</strong><button class="btn secondary" id="startMissionPrep">Start 5-min prep</button></div>${spoken?`<div class="mission-recorder"><button class="btn primary" id="cRecord">🎙️ Record</button><button class="btn danger hidden" id="cStop">■ Stop</button><audio id="cPlayback" class="hidden" controls></audio></div>`:''}</div><textarea id="missionDraft" class="writing-area" placeholder="Plan, draft or notes…"></textarea><div class="mission-review"><h3>Self-review before saving</h3><div class="rubric-grid">${['I completed the exact communicative task.','My structure is easy to follow.','My wording is precise and natural.','I qualified claims or disagreement where needed.','I used complex language without losing control.','I adapted the message to the audience and purpose.'].map(t=>`<label><input type="checkbox" class="c-mission-check"> ${t}</label>`).join('')}</div><button class="btn secondary" id="saveMissionReview">Save mission review</button></div>`;$('#newMissionPrompt').onclick=()=>{missionPromptIndices[mission.id]=((missionPromptIndices[mission.id]||0)+1)%mission.prompts.length;renderMission();};$('#startMissionPrep').onclick=()=>{if(missionTimer)return;missionRemaining=300;$('#startMissionPrep').disabled=true;missionTimer=setInterval(()=>{missionRemaining--;const m=Math.floor(missionRemaining/60),s=missionRemaining%60;$('#missionClock').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(missionRemaining<=0){stopTimer();$('#startMissionPrep').disabled=false;}},1000);};$('#saveMissionReview').onclick=()=>{const score=$$('.c-mission-check',w).filter(x=>x.checked).length;recordMission(mission,score);$('#saveMissionReview').disabled=true;$('#saveMissionReview').textContent=`Saved: ${score}/6`;};if(spoken){$('#cRecord').onclick=startCRecording;$('#cStop').onclick=()=>stopRecorder(false);}}
  async function startCRecording(){if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){alert('Audio recording is not supported in this browser.');return;}try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}$('#cStop')?.classList.add('hidden');if($('#cRecord'))$('#cRecord').disabled=false;if(recorder._discard){chunks=[];return;}if(chunks.length){if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType||'audio/webm'}));const a=$('#cPlayback');if(a){a.src=audioUrl;a.classList.remove('hidden');}}};recorder.start();$('#cRecord').disabled=true;$('#cStop').classList.remove('hidden');}catch{alert('Microphone permission was not granted.');}}
  $$('[data-mission]').forEach(b=>b.onclick=()=>openMission(b.dataset.mission));
  $$('[data-nav]').forEach(b=>b.addEventListener('click',cleanupMission));

  // Public API for unified export/import/reset and dashboard refresh.
  window.CLEVEL_APP={
    exportState:()=>JSON.parse(JSON.stringify(state)),
    importState:x=>{state=merge(x);save();},
    reset:()=>{state=defaults();try{localStorage.removeItem(KEY)}catch{}renderProgress();},
    refresh:renderProgress,
    openModule:key=>{openModule(key);document.querySelector('#cModuleWorkspace')?.scrollIntoView({behavior:'smooth',block:'start'});}
  };
  renderProgress();
  renderModule();
})();
