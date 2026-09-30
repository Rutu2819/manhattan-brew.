import { useEffect, useState } from 'react'
import './RewardsPage.css'

const NEXT_TIER = { bronze: 'Silver', silver: 'Gold', gold: 'a free item' }

function prettyReward(value) {
  if (!value) return 'None yet'
  const text = value.replace(/_/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    async function fetchRewards() {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rewards`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      setRewards(data)
      setLoading(false)
    }
    fetchRewards()
  }, [])

  if (loading) {
    return (
      <main className="mb-rw">
        <p className="mb-rw-msg">Loading rewards…</p>
      </main>
    )
  }

  if (!rewards || !rewards.tier) {
    return (
      <main className="mb-rw">
        <p className="mb-rw-msg">Could not load rewards. Please log in again.</p>
      </main>
    )
  }

  const tier = rewards.tier.toLowerCase()
  const left = Math.max(rewards.stampThreshold - rewards.stampCount, 0)

  function toggle() {
    setFlipped((f) => !f)
  }

  return (
    <main className="mb-rw">
      <header className="mb-rw-head">
        <h1>Rewards</h1>
        <p>Collect a stamp with every paid order</p>
      </header>

      <div
        className={`mb-rw-card tier-${tier} ${flipped ? 'is-flipped' : ''}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Rewards card. Press to flip."
      >
        <div className="mb-rw-inner">
          {/* ---------- FRONT ---------- */}
          <div className="mb-rw-face mb-rw-front">
            <div className="mb-rw-top">
              <span className="mb-rw-brand">Manhattan Brew</span>
              <span className="mb-rw-tier">{rewards.tier}</span>
            </div>

            <div className="mb-rw-chip" aria-hidden="true" />

            <div className="mb-rw-stamps" aria-label={`${rewards.stampCount} of ${rewards.stampThreshold} stamps`}>
              {Array.from({ length: rewards.stampThreshold }).map((_, i) => (
                <span
                  key={i}
                  className={`mb-rw-dot ${i < rewards.stampCount ? 'filled' : ''}`}
                />
              ))}
            </div>

            <div className="mb-rw-bottom">
              <div>
                <small>Card holder</small>
                <strong>{rewards.name}</strong>
              </div>
              <div className="mb-rw-count">
                <small>Stamps</small>
                <strong>{rewards.stampCount} / {rewards.stampThreshold}</strong>
              </div>
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div className="mb-rw-face mb-rw-back">
            <div className="mb-rw-stripe" aria-hidden="true" />
            <div className="mb-rw-details">
              <div className="mb-rw-row">
                <span>Discount</span>
                <strong>{rewards.discountPercent}% off</strong>
              </div>
              <div className="mb-rw-row">
                <span>Reward</span>
                <strong>{prettyReward(rewards.pendingReward)}</strong>
              </div>
              <div className="mb-rw-row">
                <span>Status</span>
                <strong>
                  {rewards.pendingReward
                    ? rewards.rewardRedeemed
                      ? 'Redeemed'
                      : 'Not redeemed yet'
                    : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-rw-hint">Tap the card to flip it</p>
      <p className="mb-rw-next">
        {left === 0
          ? 'Your next order completes this card!'
          : `${left} more ${left === 1 ? 'stamp' : 'stamps'} to reach ${NEXT_TIER[tier] || 'your next reward'}`}
      </p>
    </main>
  )
}