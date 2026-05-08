// ============================================================
// PORTFOLIO — Giovanni BINTOUL — script.js
// ============================================================

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
let veilleTimer    = null

const FALLBACK_ARTICLES = [
  { id:1, title:'React 19 : les nouvelles fonctionnalités à connaître', description:'React 19 apporte des améliorations majeures : le compilateur React, les Server Actions et une meilleure gestion des formulaires pour simplifier le développement.', url:'https://react.dev', tag_list:['React','JavaScript'], user:{name:'React Team'} },
  { id:2, title:'TypeScript 5.x : ce qui change pour les développeurs', description:'Les dernières versions de TypeScript améliorent les performances, la gestion des types et apportent de nouvelles fonctionnalités pour un code plus sûr et plus maintenable.', url:'https://www.typescriptlang.org', tag_list:['TypeScript','JavaScript'], user:{name:'Microsoft'} },
  { id:3, title:'Docker pour les développeurs web : guide pratique', description:"Découvrez comment utiliser Docker pour containeriser vos applications web, simplifier le déploiement et assurer la cohérence entre les environnements de développement.", url:'https://www.docker.com', tag_list:['Docker','DevOps'], user:{name:'Docker Team'} },
  { id:4, title:'CSS Grid et Flexbox en 2025 : les bonnes pratiques', description:"Un tour d'horizon des meilleures pratiques CSS pour créer des layouts modernes, responsives et accessibles avec Grid et Flexbox.", url:'https://css-tricks.com', tag_list:['CSS','Frontend'], user:{name:'CSS-Tricks'} },
  { id:5, title:'PHP 8.3 : les fonctionnalités qui changent tout', description:"PHP 8.3 apporte des constantes de classe typées, des améliorations sur json_validate() et de nouvelles fonctions pour rendre le développement backend plus robuste.", url:'https://www.php.net', tag_list:['PHP','Backend'], user:{name:'PHP Team'} },
  { id:6, title:'Git avancé : branches, rebase et workflows pro', description:"Maîtrisez les commandes Git avancées pour travailler efficacement en équipe : rebase interactif, cherry-pick, stash et stratégies de branching pour les projets SLAM.", url:'https://git-scm.com', tag_list:['Git','Outils'], user:{name:'Git Community'} },
]

async function fetchArticles() {
  const grid       = document.getElementById('veille-grid')
  const btn        = document.getElementById('veille-refresh-btn')
  const label      = document.getElementById('veille-refresh-label')
  const icon       = document.getElementById('veille-refresh-icon')
  const badge      = document.getElementById('veille-status-badge')
  const updateTime = document.getElementById('veille-update-time')
  if (!grid) return

  // État chargement
  label.textContent = 'Chargement…'
  icon.classList.add('spinning')
  btn.disabled = true
  grid.innerHTML = Array.from({length:6}).map(() => '<div class="skeleton-card glass-card"></div>').join('')

  let articles, usingFallback = false
  try {
    const res = await fetch('https://dev.to/api/articles?tag=webdev&per_page=6&top=1')
    if (!res.ok) throw new Error()
    const data = await res.json()
    if (!data || data.length === 0) throw new Error()
    articles = data
  } catch {
    articles = FALLBACK_ARTICLES
    usingFallback = true
  }

  veilleArticles = articles

  // Badge statut
  if (usingFallback) {
    badge.className = 'status-badge status-badge--info'
    badge.innerHTML = 'Articles sélectionnés'
  } else {
    badge.className = 'status-badge'
    badge.innerHTML = '<span class="live-dot"></span>Live – Dev.to'
  }

  // Heure de mise à jour
  updateTime.textContent = 'Mis à jour à ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})

  // Rendu des cartes
  grid.innerHTML = ''
  articles.forEach((a, i) => {
    const card = document.createElement('a')
    card.className = 'article-card glass-card'
    card.href = a.url
    card.target = '_blank'
    card.rel = 'noreferrer'
    card.style.animationDelay = i * 0.08 + 's'

    const tags = (a.tag_list || []).slice(0,2).map(t => `<span class="article-tag">${t}</span>`).join('')
    const desc = (a.description || '').slice(0, 110) + '…'
    const imgHtml = a.cover_image
      ? `<img src="${a.cover_image}" alt="${a.title}" onerror="this.parentElement.innerHTML='<div class=article-card__img-placeholder><svg width=28 height=28 viewBox=&quot;0 0 24 24&quot; fill=none stroke=currentColor stroke-width=1.5 opacity=.3><rect x=3 y=3 width=18 height=18 rx=2/><circle cx=8.5 cy=8.5 r=1.5/><path d=&quot;M21 15l-5-5L5 21&quot;/></svg></div>'">`
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

  // Reset bouton
  label.textContent = 'Actualiser'
  icon.classList.remove('spinning')
  btn.disabled = false

  // Rafraîchissement automatique toutes les 5 minutes
  clearInterval(veilleTimer)
  veilleTimer = setInterval(fetchArticles, 5 * 60 * 1000)
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

// ─── Cookie banner ─────────────────────────────────────────

function handleCookie(choice) {
  localStorage.setItem('cookieConsent', choice)
  const banner = document.getElementById('cookie-banner')
  const settingsBtn = document.getElementById('cookie-settings-btn')
  banner.classList.remove('cookie-banner--visible')
  banner.setAttribute('aria-hidden', 'true')
  settingsBtn.style.display = 'block'
}

function reopenCookieBanner() {
  const banner = document.getElementById('cookie-banner')
  banner.classList.add('cookie-banner--visible')
  banner.setAttribute('aria-hidden', 'false')
}

function initCookieBanner() {
  const stored = localStorage.getItem('cookieConsent')
  const settingsBtn = document.getElementById('cookie-settings-btn')
  if (!stored) {
    // Affiche la bannière avec un léger délai pour l'animation d'entrée
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner')
      banner.classList.add('cookie-banner--visible')
      banner.setAttribute('aria-hidden', 'false')
    }, 900)
  } else {
    settingsBtn.style.display = 'block'
  }
}

// ─── Initialisation ────────────────────────────────────────

function init() {
  loadTheme()
  initParticles()
  initAccueil()
  initCookieBanner()
}

init()
