# Portfolio – Giovanni BINTOUL

Portfolio personnel · BTS SIO SLAM · Lycée Melkior-Garré  
Version pure HTML/CSS/JS — aucun framework, aucun build requis.

---

## Ouvrir localement

Double-clique sur `index.html` — c'est tout.  
Ou utilise une extension Live Server dans VS Code pour avoir le rechargement automatique.

---

## Structure du projet

```
portfolio/
├── index.html          ← Page unique (toutes les sections)
├── style.css           ← Tous les styles (light + dark mode)
├── script.js           ← Navigation, animations, API, cookies
└── assets/
    └── documents/      ← Place ici tous tes PDFs et fichiers
        ├── CV.pdf
        ├── rapport-stage-dede.pdf
        ├── rapport-stage-cayenne.pdf
        ├── rapport-projet-1.pdf
        ├── rapport-projet-2.pdf
        ├── attestation-stage-1.pdf
        ├── attestation-stage-2.pdf
        ├── projet-antivol.pdf
        └── tableau-synthese.xlsx
```

---

## Modifier le contenu

### Changer ton nom / texte d'accueil
Ouvre `index.html` → section `#page-accueil`.

### Modifier les textes du typing effect
Ouvre `script.js` → tableau `TYPING_STRINGS` (ligne ~12).

### Ajouter un projet
Dans `index.html`, duplique un bloc `.project-card` dans `#page-projets`.

### Modifier les compétences
Dans `index.html`, change les valeurs `data-level="XX"` dans `#page-competences`.

### Ajouter ta photo
Dans `#page-moi`, remplace le bloc `.avatar-placeholder` par :
```html
<img src="./assets/images/photo.jpg" alt="Giovanni" style="width:200px; border-radius:50%; object-fit:cover;">
```

### Activer l'aperçu du tableau de synthèse (Google Docs Viewer)
Dans `index.html`, dans la section Compétences, remplace `VOTRE-DOMAINE` par ton vrai domaine déployé.  
Exemple : `gio2ni.github.io/portfolio`

---

## Déployer sur GitHub Pages

1. Crée un dépôt GitHub (ex : `portfolio`)
2. Pousse tous les fichiers à la racine du dépôt :
   ```
   index.html, style.css, script.js, assets/
   ```
3. Dans les paramètres du dépôt → **Pages** → Source : `main` / `root`
4. Ton site sera disponible sur `https://gio2ni.github.io/portfolio`

> Les PDFs dans `assets/documents/` seront accessibles automatiquement.

---

**Design** : Glassmorphism · Bleu + Violet + Cyan  
**Stack** : HTML · CSS · JavaScript vanilla  
**API** : Dev.to (articles tech, rafraîchissement auto 5 min)
