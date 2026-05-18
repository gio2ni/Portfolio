// ============================================================
// PORTFOLIO — Giovanni BINTOUL — script.js
// ============================================================

// ─── Bouton Android Studio ────────────────────────────────
function ouvrirAndroidStudio() {
  const cmd = 'open -a "Android Studio" /Users/valentino/Documents/bts/AntiVol'
  navigator.clipboard.writeText(cmd).then(() => {
    const toast = document.getElementById('android-toast')
    toast.classList.add('android-toast--visible')
    setTimeout(() => toast.classList.remove('android-toast--visible'), 3000)
  })
}

// ─── Navigation SPA ───────────────────────────────────────

let activePage = 'accueil'

// Affiche la section demandée, cache les autres
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'))
  const target = document.getElementById('page-' + pageId)
  if (target) target.classList.add('page--active')

  // Met à jour le lien actif dans la navbar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('nav-link--active', link.dataset.page === pageId)
  })

  activePage = pageId
  closeMenu()
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Déclenche les animations de la page cible
  if (pageId === 'competences') initSkillBars()
  if (pageId === 'moi')         initMoiAnimation()
  if (pageId === 'contact')     initContactAnimation()
  if (pageId === 'veille' && veilleArticles.length === 0) fetchArticles()
}

// ─── Burger menu mobile ────────────────────────────────────

function toggleMenu() {
  const burger = document.getElementById('burger')
  const links  = document.getElementById('navbar-links')
  burger.classList.toggle('open')
  links.classList.toggle('navbar__links--open')
}

function closeMenu() {
  document.getElementById('burger').classList.remove('open')
  document.getElementById('navbar-links').classList.remove('navbar__links--open')
}

// ─── Navbar scroll ─────────────────────────────────────────

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('navbar--scrolled', window.scrollY > 20)
})

// ─── Dark / Light mode ─────────────────────────────────────

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark-mode')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode')
  }
}

// ─── Typing effect (accueil) ───────────────────────────────

const TYPING_STRINGS = [
  'Développeur Web',
  'Étudiant BTS SIO SLAM',
  'Créer, apprendre et innover chaque jour',
]

let typedEl    = null
let tStrIndex  = 0
let tCharIndex = 0
let tDeleting  = false
let tTimer     = null

function typeStep() {
  const current = TYPING_STRINGS[tStrIndex]
  if (!tDeleting && tCharIndex < current.length) {
    tCharIndex++
    tTimer = setTimeout(typeStep, 75)
  } else if (!tDeleting && tCharIndex === current.length) {
    tTimer = setTimeout(() => { tDeleting = true; typeStep() }, 1800)
  } else if (tDeleting && tCharIndex > 0) {
    tCharIndex--
    tTimer = setTimeout(typeStep, 38)
  } else {
    tDeleting  = false
    tStrIndex  = (tStrIndex + 1) % TYPING_STRINGS.length
    tTimer = setTimeout(typeStep, 200)
  }
  if (typedEl) typedEl.textContent = current.slice(0, tCharIndex)
}

// ─── Particules accueil ────────────────────────────────────

function initParticles() {
  const container = document.getElementById('particles-container')
  if (!container) return
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    p.style.setProperty('--i', i)
    container.appendChild(p)
  }
}

// ─── Animation d'entrée accueil ────────────────────────────

function initAccueil() {
  setTimeout(() => {
    const content = document.getElementById('accueil-content')
    if (content) content.classList.add('visible')
  }, 100)

  typedEl = document.getElementById('typed-text')
  clearTimeout(tTimer)
  typeStep()
}

// ─── Animation moi (grille) ────────────────────────────────

function initMoiAnimation() {
  const grid = document.getElementById('moi-grid')
  if (grid) setTimeout(() => grid.classList.add('moi__grid--visible'), 100)
}

// ─── Animation contact (icônes) ────────────────────────────

function initContactAnimation() {
  document.querySelectorAll('.contact-icon-btn').forEach((btn, i) => {
    setTimeout(() => btn.classList.add('contact-icon-btn--visible'), i * 80)
  })
}

// ─── Barres de compétences ─────────────────────────────────

function initSkillBars() {
  document.querySelectorAll('[data-cat]').forEach((card, index) => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      setTimeout(() => {
        card.classList.add('cat-card--visible')
        // Déclenche l'animation des barres après l'apparition de la carte
        setTimeout(() => {
          card.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.setProperty('--target', bar.dataset.level + '%')
            bar.classList.add('skill-fill--animate')
          })
        }, 200)
      }, index * 150)
    }, { threshold: 0.3 })
    obs.observe(card)
  })

  // Tableau de synthèse
  const synthese = document.getElementById('synthese-card')
  if (synthese) {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { synthese.classList.add('synthese-card--visible'); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(synthese)
  }
}

// ─── Veille technologique ──────────────────────────────────

let veilleArticles = []

// Articles de secours si l'API est inaccessible
const FALLBACK_ARTICLES = [
  { id:1, title:'JavaScript en 2025 : les nouveautés à connaître', description:"Tour d'horizon des dernières évolutions du langage JavaScript : nouvelles syntaxes, APIs natives et bonnes pratiques pour écrire un code plus moderne et maintenable.", url:'https://developer.mozilla.org/fr/docs/Web/JavaScript', tag_list:['JavaScript','Web'], user:{name:'MDN Web Docs'} },
  { id:2, title:'CSS Grid et Flexbox : maîtriser la mise en page', description:"Guide complet pour créer des mises en page modernes et responsives avec CSS Grid et Flexbox. Comprendre quand utiliser l'un ou l'autre selon la situation.", url:'https://css-tricks.com/snippets/css/complete-guide-grid/', tag_list:['CSS','Frontend'], user:{name:'CSS-Tricks'} },
  { id:3, title:'PHP 8 : les fonctionnalités qui simplifient le code', description:"PHP 8 apporte des améliorations importantes : le JIT compiler, les named arguments, les match expressions et les attributs. Découvrez comment en profiter.", url:'https://www.php.net/releases/8.0', tag_list:['PHP','Backend'], user:{name:'PHP.net'} },
  { id:4, title:'Git et GitHub : workflow collaboratif en équipe', description:"Apprenez à utiliser Git efficacement en équipe : branches, pull requests, résolution de conflits et bonnes pratiques pour un historique propre et lisible.", url:'https://git-scm.com/book/fr/v2', tag_list:['Git','Outils'], user:{name:'Git SCM'} },
  { id:5, title:'Sécurité web : les 10 vulnérabilités OWASP à connaître', description:"Présentation des 10 failles de sécurité les plus critiques selon l'OWASP : injection SQL, XSS, CSRF... et comment les prévenir dans ses propres applications.", url:'https://owasp.org/www-project-top-ten/', tag_list:['Sécurité','Web'], user:{name:'OWASP'} },
  { id:6, title:'SQL : optimiser ses requêtes pour de meilleures performances', description:"Techniques d'optimisation SQL : utilisation des index, éviter les sous-requêtes inutiles, comprendre EXPLAIN et écrire des jointures efficaces.", url:'https://sql.sh', tag_list:['SQL','Base de données'], user:{name:'SQL.sh'} },
]

async function fetchArticles() {
  const grid       = document.getElementById('veille-grid')
  const badge      = document.getElementById('veille-status-badge')
  const updateTime = document.getElementById('veille-update-time')
  if (!grid) return

  // Skeletons au premier chargement uniquement
  if (veilleArticles.length === 0) {
    grid.innerHTML = Array.from({length:6}).map(() => '<div class="skeleton-card glass-card"></div>').join('')
  }

  let articles, usingFallback = false
  try {
    // Récupère les 6 articles récents tagués webdev, javascript ou css
    const tags = ['javascript', 'css', 'webdev', 'php', 'git', 'sql']
    const tag  = tags[Math.floor(Math.random() * tags.length)]
    const res  = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=6&state=rising`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    if (!data || data.length === 0) throw new Error()
    // Mélange les résultats pour plus de variété à chaque visite
    articles = data.sort(() => Math.random() - 0.5)
  } catch {
    articles     = FALLBACK_ARTICLES
    usingFallback = true
  }

  veilleArticles = articles

  // Badge statut
  if (badge) {
    badge.className = usingFallback ? 'status-badge status-badge--info' : 'status-badge'
    badge.innerHTML = usingFallback
      ? 'Articles sélectionnés'
      : '<span class="live-dot"></span>Live – Dev.to'
  }

  // Heure de chargement
  if (updateTime) {
    updateTime.textContent = 'Mis à jour à ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})
  }

  // Rendu des cartes
  grid.innerHTML = ''
  articles.forEach((a, i) => {
    const card = document.createElement('a')
    card.className = 'article-card glass-card'
    card.href      = a.url
    card.target    = '_blank'
    card.rel       = 'noreferrer'
    card.style.animationDelay = i * 0.08 + 's'

    const tags    = (a.tag_list || []).slice(0,2).map(t => `<span class="article-tag">${t}</span>`).join('')
    const desc    = (a.description || '').slice(0, 110) + '…'
    const imgHtml = a.cover_image
      ? `<img src="${a.cover_image}" alt="${a.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=article-card__img-placeholder><svg width=28 height=28 viewBox=&quot;0 0 24 24&quot; fill=none stroke=currentColor stroke-width=1.5 opacity=.3><rect x=3 y=3 width=18 height=18 rx=2/><circle cx=8.5 cy=8.5 r=1.5/><path d=&quot;M21 15l-5-5L5 21&quot;/></svg></div>'">`
      : `<div class="article-card__img-placeholder"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`

    card.innerHTML = `
      <div class="article-card__img">${imgHtml}</div>
      <div class="article-card__body">
        <div class="article-card__tags">${tags}</div>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-desc">${desc}</p>
        <div class="article-meta"><span>${a.user?.name || 'Dev.to'}</span><span class="article-link-hint">Lire →</span></div>
      </div>`
    grid.appendChild(card)
  })
}

// ─── Téléchargement de documents ──────────────────────────

async function downloadDoc(href, downloadName, btn) {
  const originalText = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = btn.innerHTML.replace(/Télécharger/, 'Chargement…')

  try {
    const res = await fetch(href)
    if (!res.ok) throw new Error()
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = downloadName
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // Fallback : ouvre dans un nouvel onglet si le fetch échoue
    window.open(href, '_blank')
  }

  btn.innerHTML = originalText
  btn.disabled  = false
}


// ─── Initialisation ────────────────────────────────────────

function init() {
  loadTheme()
  initParticles()
  initAccueil()
  // Préchargement des articles dès l'ouverture du site
  fetchArticles()
}

init()
