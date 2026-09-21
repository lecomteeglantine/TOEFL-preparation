# Homemade TOEFL Trainer — C1/C2

Site statique prêt à déposer sur GitHub Pages.

## Contenu

- Accueil et parcours « Start here » inspiré du Homemade TOEIC Trainer
- Présentation du TOEFL iBT en vigueur depuis le 21 janvier 2026
- Diagnostic pédagogique de 24 questions (Reading, Listening, Speaking, Writing)
- Tableau de bord avec sauvegarde locale, objectif 5 / 5.5 / 6, export/import JSON
- Reading : Complete the Words, Read in Daily Life, Read an Academic Passage
- Listening : Choose a Response, Conversation, Announcement, Academic Talk
- Speaking : Listen and Repeat + Take an Interview avec enregistrement micro local
- Writing : Build a Sentence, Write an Email, Academic Discussion
- Academic Vocabulary C1/C2 avec synthèse vocale et My Words
- C-Level Lab : hedging, nominalisation, complex sentences, paraphrase, stance, cohesion
- Accessibilité : taille du texte, contraste, police de lecture, réduction des animations, mode focus
- PWA légère / service worker

## Déploiement GitHub Pages

1. Créer un nouveau dépôt GitHub, par exemple `homemade-toefl-trainer`.
2. Déposer **tout le contenu de ce dossier à la racine** du dépôt.
3. Dans GitHub : **Settings → Pages**.
4. Sous **Build and deployment**, choisir **Deploy from a branch**.
5. Sélectionner la branche `main` et le dossier `/ (root)` puis enregistrer.

## Fichiers indispensables

- `index.html`
- `styles.css`
- `data.js`
- `app.js`
- `manifest.webmanifest`
- `sw.js`

## Données et confidentialité

La progression est stockée uniquement dans `localStorage` sur l'appareil de l'utilisateur. Aucun serveur, compte ou base de données n'est nécessaire.

L'enregistrement audio Speaking utilise l'API `MediaRecorder` du navigateur. Il fonctionne sur GitHub Pages (HTTPS) si l'utilisateur autorise le micro. L'audio n'est pas envoyé ailleurs et n'est pas conservé après rechargement de la page.

## Sources officielles utilisées pour le format du test

Format vérifié en septembre 2026 :
- https://www.ets.org/toefl/test-takers/ibt/about/content.html
- https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html

Le site est indépendant et non affilié à ETS. TOEFL et ETS sont des marques déposées d'ETS. Les exercices sont originaux.
