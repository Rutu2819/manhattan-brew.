import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { helpItems } from '../Data/helpData.js'
import './Account.css'

const AVATARS = [
  { emoji: '🙂', label: 'Smiley' },
  { emoji: '🙃', label: 'Upside-down smiley' },
  { emoji: '😎', label: 'Sunglasses' },
  { emoji: '🐰', label: 'Rabbit' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '☕', label: 'Coffee' }
]

const avatarKey = (u) => `avatar:${u.id || u.email || 'user'}`

export default function AccountPage() {
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const [rating, setRating] = useState(0)
  const [activePanel, setActivePanel] = useState(null)
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState('🙂')
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const navigate = useNavigate()
  const API_URL = `${import.meta.env.VITE_API_URL}`

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      const savedAvatar = localStorage.getItem(avatarKey(parsed))
      if (savedAvatar) setAvatar(savedAvatar)
    }
  }, [])

  const chooseAvatar = (emoji) => {
    setAvatar(emoji)
    if (user) localStorage.setItem(avatarKey(user), emoji)
  }

  const submitFeedback = () => {
    setFeedbackSent(true)
    setFeedbackText('')
  }

  const saveName = async () => {
    try {
      setSavingName(true)
      setNameSaved(false)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/auth/update-name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: user.name })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update name')
      }
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    } catch (error) {
      console.error('Error updating name:', error)
    } finally {
      setSavingName(false)
    }
  }

  const togglePanel = (name) => {
    setActivePanel(activePanel === name ? null : name)
  }

  return (
    <main className="mb-acc">
      <header className="mb-acc-head">
        <h1>Account</h1>
      </header>

      {user ? (
        <section className="mb-acc-profile">
          <div className="mb-acc-avatar" aria-hidden="true">{avatar}</div>

          <div className="mb-acc-picker" role="radiogroup" aria-label="Choose your avatar">
            {AVATARS.map((a) => (
              <button
                key={a.emoji}
                type="button"
                role="radio"
                aria-checked={avatar === a.emoji}
                aria-label={a.label}
                title={a.label}
                className={`mb-acc-pick ${avatar === a.emoji ? 'is-active' : ''}`}
                onClick={() => chooseAvatar(a.emoji)}
              >
                {a.emoji}
              </button>
            ))}
          </div>

          <div className="mb-acc-name-row">
            <input
              type="text"
              className="mb-acc-name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Your name"
              disabled={savingName}
              aria-label="Your name"
            />
            <button className="mb-acc-save" onClick={saveName} disabled={savingName}>
              {savingName ? 'Saving…' : nameSaved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </section>
      ) : (
        <section className="mb-acc-guest">
          <div className="mb-acc-avatar" aria-hidden="true">☕</div>
          <p>Log in or sign up to get your offers and discounts.</p>
          <button className="mb-acc-save" onClick={() => navigate('/login')}>
            Login / Sign Up
          </button>
        </section>
      )}

      <section className="mb-acc-menu">
        {/* Feedback */}
        <div className={`mb-acc-item ${activePanel === 'feedback' ? 'is-open' : ''}`}>
          <button
            className="mb-acc-toggle"
            onClick={() => togglePanel('feedback')}
            aria-expanded={activePanel === 'feedback'}
          >
            <span>Feedback</span>
            <span className="mb-acc-chevron" aria-hidden="true">›</span>
          </button>
          <div className="mb-acc-panel">
            <div className="mb-acc-panel-inner">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What should we fix, add, or brew next?"
              />
              <button className="mb-acc-action" onClick={submitFeedback}>
                Send feedback
              </button>
              {feedbackSent && <p className="mb-acc-thanks">Thank you for your feedback!</p>}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={`mb-acc-item ${activePanel === 'faq' ? 'is-open' : ''}`}>
          <button
            className="mb-acc-toggle"
            onClick={() => togglePanel('faq')}
            aria-expanded={activePanel === 'faq'}
          >
            <span>FAQ</span>
            <span className="mb-acc-chevron" aria-hidden="true">›</span>
          </button>
          <div className="mb-acc-panel">
            <div className="mb-acc-panel-inner">
              {helpItems.map((item, index) => (
                <div key={index} className="mb-acc-faq">
                  <button
                    className="mb-acc-faq-q"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    {item.question}
                  </button>
                  {openIndex === index && <p className="mb-acc-faq-a">{item.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate */}
        <div className={`mb-acc-item ${activePanel === 'rate' ? 'is-open' : ''}`}>
          <button
            className="mb-acc-toggle"
            onClick={() => togglePanel('rate')}
            aria-expanded={activePanel === 'rate'}
          >
            <span>Rate</span>
            <span className="mb-acc-chevron" aria-hidden="true">›</span>
          </button>
          <div className="mb-acc-panel">
            <div className="mb-acc-panel-inner">
              <div className="mb-acc-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => setRating(star)}
                    className={`mb-acc-star ${star <= rating ? 'filled' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}