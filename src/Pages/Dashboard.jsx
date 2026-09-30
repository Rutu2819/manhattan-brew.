import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../Data/menuData'
import './Dashboard.css'
import { spawnBeans } from '../components/BeanBackground'

export default function Dashboard() {
  const menuRef = useRef(null)
  const heroBeansRef = useRef(null)
  const flatlayBeansRef = useRef(null)

  useEffect(() => {
    if (heroBeansRef.current && heroBeansRef.current.childElementCount === 0) {
      spawnBeans(heroBeansRef.current, 24, 0.3)
    }
  }, [])

  // Frozen at mount time — won't change mid-session even if sessionStorage updates
  const [alreadySeenIntro] = useState(
    () => sessionStorage.getItem('mb-intro-seen') === 'true'
  )
  const [showSkip, setShowSkip] = useState(alreadySeenIntro)

  useEffect(() => {
    if (alreadySeenIntro) return

    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      setShowSkip(true)
      document.body.style.overflow = 'auto'
      sessionStorage.setItem('mb-intro-seen', 'true')
    }, 1400)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = 'auto'
    }
  }, [alreadySeenIntro])

  useEffect(() => {
    if (alreadySeenIntro) {
      menuRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [alreadySeenIntro])

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
  if (flatlayBeansRef.current && flatlayBeansRef.current.childElementCount === 0) {
    spawnBeans(flatlayBeansRef.current, 24, 0.3)
  }
}, [])

  return (
    <div>
      <div className={`mb-hero ${alreadySeenIntro ? 'mb-no-anim' : ''}`}>
        <div className="mb-hero-beans" ref={heroBeansRef} />
        <h1 className="mb-hero-title">Manhattan Brew</h1>
        <p className="mb-tagline">— Sip the City —</p>
        <p className="mb-hero-sub">
          Eight counters, one café.<br />
          Find your vibe and order up.
        </p>
        {showSkip && (
          <button className="mb-skip-btn mb-skip-btn-in" onClick={scrollToMenu}>
            Skip to Menu ↓
          </button>
        )}
      </div>

      <div className="mb-ai-teaser" ref={menuRef}>
        <div className="mb-ai-card">
          <span className="mb-ai-badge">AI</span>
          <div>
            <h3>Not sure what you want?</h3>
            <p>Tell us your mood and budget — we'll build the combo.</p>
          </div>
          <Link to="/combo-finder" className="mb-ai-cta">Find My Combo</Link>
        </div>
      </div>

      <div className="mb-menu-section">
        <h2>Choose Your Counter</h2>

        <div className="mb-counter-grid">
          {categories.map((cat) => (
            <Link to={`/menu/${cat.slug}`} className="mb-counter-card" key={cat.slug}>
              <div className="mb-counter-photo">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <span className="mb-counter-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-flatlay-section">
         <div className="mb-flatlay-beans" ref={flatlayBeansRef} />
        <div className="mb-flatlay-plates">
          {[
            { icon: '☕', top: '12%', left: '8%', size: 70, color: '#c1502e' },
            { icon: '🥐', top: '68%', left: '6%', size: 56, color: '#c9a227' },
            { icon: '🍰', top: '20%', left: '88%', size: 64, color: '#d98a8a' },
            { icon: '🍹', top: '72%', left: '90%', size: 60, color: '#3e6259' },
            { icon: '🍝', top: '8%', left: '48%', size: 50, color: '#2b1b12', hideMobile: true },
            { icon: '🍵', top: '85%', left: '45%', size: 52, color: '#c9a227', hideMobile: true },
          ].map((plate, i) => (
            <span
              key={i}
              className={`mb-flatlay-plate${plate.hideMobile ? ' mb-hide-mobile' : ''}`}
              style={{
                top: plate.top,
                left: plate.left,
                width: plate.size,
                height: plate.size,
                fontSize: plate.size * 0.42,
                '--counter-color': plate.color,
              }}
            >
              {plate.icon}
            </span>
          ))}
        </div>
        <div className="mb-flatlay-card">
          <h2>Freshly Brewed,<br />Just for You!</h2>
          <p>Eight counters of coffee, pastry, and late-night comfort — made fresh, every single day.</p>
          <button className="mb-flatlay-cta" onClick={scrollToMenu}>Order Now</button>
        </div>
      </div>

      <section className="mb-why">
        <h2 className="mb-why-heading">Why Choose Us?</h2>
        <div className="mb-why-grid">
          <div className="mb-why-card">
            <div className="mb-why-icon" style={{ '--counter-color': 'var(--mb-gold)' }}>☕</div>
            <h3>Freshly Brewed</h3>
            <p>Every cup and plate made fresh, never sitting around.</p>
          </div>
          <div className="mb-why-card">
            <div className="mb-why-icon" style={{ '--counter-color': 'var(--mb-teal)' }}>🎧</div>
            <h3>Cozy Vibes</h3>
            <p>NYC subway-inspired corners built for lingering.</p>
          </div>
          <div className="mb-why-card">
            <div className="mb-why-icon" style={{ '--counter-color': 'var(--mb-violet)' }}>⚡</div>
            <h3>Smart & Fast</h3>
            <p>AI-picked combos so you order in seconds, not minutes.</p>
          </div>
        </div>
      </section>

      <section className="mb-visit">
        <h2 className="mb-visit-heading">Visit Us Today</h2>
        <p className="mb-visit-text">
          Step into Manhattan Brew — where every cup tells a story of the city that never sleeps.
        </p>
        <button className="mb-visit-cta" onClick={scrollToMenu}>
          See What's Brewing
        </button>
        <p className="mb-visit-hours">Open daily, 8am - 10pm.</p>
        <p className="mb-contact-support">Have questions? <a href="/contact">Contact our support team</a>.</p>
      </section>
    </div>
  )
}