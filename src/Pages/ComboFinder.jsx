import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { combos, moods, budgetRanges } from '../Data/comboData'
import './ComboFinder.css'
import { allItems } from '../Data/menuData.js'
import { useCart } from '../context/CartContext.jsx'

/* AI message: shows "..." dots, then types word by word */
function AIMessage({ text, dotsOnly = false, onDone, wordDelay = 80, thinkDelay = 600 }) {
  const words = text ? text.split(' ') : []
  const [phase, setPhase] = useState('thinking') // thinking -> typing -> done
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (dotsOnly) return
    const t = setTimeout(() => setPhase('typing'), thinkDelay)
    return () => clearTimeout(t)
  }, [dotsOnly, thinkDelay])

  useEffect(() => {
    if (dotsOnly || phase !== 'typing') return
    if (count >= words.length) {
      setPhase('done')
      onDone?.()
      return
    }
    const t = setTimeout(() => setCount((c) => c + 1), wordDelay)
    return () => clearTimeout(t)
  }, [dotsOnly, phase, count]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-cf-bot">
      <span className="mb-cf-avatar">AI</span>
      <p>
        {dotsOnly || phase === 'thinking' ? (
          <span className="mb-cf-dots" aria-label="Café AI is typing">
            <i /><i /><i />
          </span>
        ) : (
          <>
            {words.slice(0, count).join(' ')}
            {phase === 'typing' && <span className="mb-cf-cursor" />}
          </>
        )}
      </p>
    </div>
  )
}

export default function ComboFinder() {
  const [mood, setMood] = useState(null)
  const [budget, setBudget] = useState(null)
  const [combo, setCombo] = useState(null)
  const [reason, setReason] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  // typing-flow state
  const [step, setStep] = useState(0)              // 0: first msg, 1: second msg, 2: moods visible
  const [budgetReady, setBudgetReady] = useState(false)
  const [recoDone, setRecoDone] = useState(false)

  const fetchSuggestion = async () => {
    if (!mood || !budget) return
    setLoading(true)
    setError(null)
    setCombo(null)
    setRecoDone(false)
    setAdded(false) 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/combo/suggest`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ mood_key: mood.key, budget_label: budget.label })
      })
      if (!response.ok) {
        throw new Error("Server returned an error")
      }
      const data = await response.json()
      setCombo(data.combo)
      setReason(data.reason)
    } catch (err) {
      setError("Failed to fetch suggestion. Please Try Again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestion()
  }, [mood, budget])

  const restart = () => {
    setMood(null)
    setBudget(null)
    setCombo(null)
    setReason(null)
    setError(null)
    setBudgetReady(false)
    setRecoDone(false)
    setAdded(false) 
  }

  const handleAddCombo = () => {
  if (!combo || added) return

  addToCart({
    id: `combo-${combo.id ?? combo.name}`,
    name: combo.name,
    price: combo.price,                 // ₹590, not the ₹680 item total
    image: comboItems[0]?.image,
    description: combo.items.join(' + '),
    isCombo: true,
    comboItems: combo.items,
  })

  setAdded(true)
  setTimeout(() => setAdded(false), 2200)
}

  const comboItems = combo
    ? combo.items
        .map((name) => allItems.find((i) => i.name === name))
        .filter(Boolean)
    : []

  const recoText = error
    ? error
    : combo
    ? "Based on your mood and budget, here's what I recommend:"
    : "Let's find your perfect combo!"

  return (
    <div className="mb-cf">
      <Link to="/" className="mb-back-link mb-back-link-dark">← Back to Dashboard</Link>

      <AIMessage
        text="Hi! I'm your Café AI. Let's find the perfect combo for you."
        onDone={() => setStep(1)}
      />

      {/* Step 1: mood */}
      {step >= 1 && (
        <AIMessage
          text="What kind of taste are you in the mood for today?"
          onDone={() => setStep(2)}
        />
      )}

      {step >= 2 && (
        <div className="mb-cf-mood-grid">
          {moods.map((m) => (
            <button
              key={m.key}
              className={`mb-cf-mood-card ${mood?.key === m.key ? 'mb-cf-mood-active' : ''}`}
              onClick={() => setMood(m)}
            >
              <span className="mb-cf-mood-emoji">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: budget, only shows once mood is picked */}
      {mood && (
        <>
          <AIMessage
            text="Got it! What's your budget range?"
            onDone={() => setBudgetReady(true)}
          />
          {budgetReady && (
            <div className="mb-cf-options mb-cf-fade">
              {budgetRanges.map((range) => (
                <button
                  key={range.label}
                  className={`mb-cf-chip ${budget?.label === range.label ? 'mb-cf-chip-active' : ''}`}
                  onClick={() => setBudget(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 3: results, only shows once budget is picked */}
      {budget && (
        <>
          <AIMessage
            key={loading ? 'loading' : recoText}
            dotsOnly={loading}
            text={recoText}
            thinkDelay={300}
            onDone={() => setRecoDone(true)}
          />

          {combo && recoDone && (
            <div className="mb-cf-results mb-cf-fade">
              <div className="mb-cf-card">
                <div className="mb-cf-card-top" style={{ background: combo.color }}>
                  {combo.name}
                </div>

                {comboItems.length > 0 && (
                  <div className={`mb-combo-images mb-combo-images--${Math.min(comboItems.length, 4)}`}>
                    {comboItems.slice(0, 4).map((item) => (
                      <img key={item.id} src={item.image} alt={item.name} />
                    ))}
                  </div>
                )}

                <ul>
                  {combo.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mb-cf-price">₹{combo.price}</p>
                <p className="mb-cf-tagline">{combo.tagline}</p>
                <p className="mb-cf-reason">{reason}</p>
              </div>

              <button
  className={`mb-cf-add-combo ${added ? 'mb-cf-add-combo--done' : ''}`}
  onClick={handleAddCombo}
>
  {added ? '✓ Added to Cart' : 'Add Combo To Cart'}
</button>

{added && (
  <Link to="/order" className="mb-cf-view-order">View your order →</Link>
)}

              <button className="mb-cf-restart" onClick={restart}>
                Start Over
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}