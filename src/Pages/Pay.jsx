import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Pay.css'

const METHODS = [
  { id: 'cash', icon: '💵', title: 'Cash', desc: 'Pay at the counter when you collect' },
  { id: 'upi', icon: '📱', title: 'UPI', desc: 'GPay, PhonePe, Paytm and more' },
  { id: 'card', icon: '💳', title: 'Credit Card', desc: 'Visa, Mastercard, RuPay' }
]

export default function Pay() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [method, setMethod] = useState('cash')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState(false)

  // ---------- formatting helpers ----------
  function handleCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    setCard({ ...card, number: digits.replace(/(.{4})/g, '$1 ').trim() })
  }

  function handleExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    setCard({ ...card, expiry: formatted })
  }

  function handleCvv(value) {
  setCard({ ...card, cvv: value.replace(/\D/g, '').slice(0, 4) })
}

  // ---------- validation ----------
  const upiValid = /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())

  const expiryValid = (() => {
    const match = card.expiry.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return false
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return false
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)
    return endOfMonth >= new Date()
  })()

 // MOCK PAYMENT: accept any card details, only require some CVV digits
const cardValid = card.cvv.length >= 3

  const canPay =
    method === 'cash' || (method === 'upi' && upiValid) || (method === 'card' && cardValid)

  // ---------- confirm ----------
 async function confirmPayment() {
  if (!canPay || processing) return
  setProcessing(true)
  try {
    const token = localStorage.getItem('token')
const res = await fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    console.log('pay response:', res.status, data)
    if (data.order) {
      setPaid(true)
    } else {
      alert('Payment could not be completed. Please try again.')
    }
  } catch (err) {
    console.error('pay error:', err)
    alert('Could not reach the server. Please try again.')
  } finally {
    setProcessing(false)
  }
}

   const buttonLabel = processing
    ? 'Processing…'
    : method === 'cash'
    ? 'Place Order — Pay at Counter'
    : 'Confirm Payment'

  if (paid) {
    return (
      <main className="mb-pay">
        <section className="mb-pay-card mb-pay-done">
          <span className="mb-pay-done-icon" aria-hidden="true">✓</span>
          <h1>{method === 'cash' ? 'Order placed!' : 'Payment confirmed!'}</h1>
          <p>
            {method === 'cash'
              ? 'Pay in cash at the counter when you pick up your order.'
              : 'Your order is being prepared. Thank you!'}
          </p>
          <p className="mb-pay-order">Order #{orderId?.slice(0, 8)}</p>
          <button className="mb-pay-confirm" onClick={() => navigate('/rewards')}>
            View my rewards
          </button>
          <button className="mb-pay-back" onClick={() => navigate('/')}>
            Back to home
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="mb-pay">
      <header className="mb-pay-head">
        <h1>Choose How to Pay</h1>
        <p className="mb-pay-order">Order #{orderId?.slice(0, 8)}</p>
      </header>

      <section className="mb-pay-card">
        <div className="mb-pay-methods" role="radiogroup" aria-label="Payment method">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={method === m.id}
              className={`mb-pay-method ${method === m.id ? 'is-active' : ''}`}
              onClick={() => setMethod(m.id)}
            >
              <span className="mb-pay-method-icon" aria-hidden="true">{m.icon}</span>
              <span className="mb-pay-method-text">
                <strong>{m.title}</strong>
                <small>{m.desc}</small>
              </span>
              <span className="mb-pay-radio" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="mb-pay-panel">
          {method === 'cash' && (
            <p className="mb-pay-cash">
              Your order goes straight to the counter. Pay in cash when you pick it up.
            </p>
          )}

          {method === 'upi' && (
            <div className="mb-pay-field">
              <label htmlFor="upi">UPI ID</label>
              <input
                id="upi"
                type="text"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                autoComplete="off"
              />
              {upiId && !upiValid && (
                <span className="mb-pay-error">Enter a valid UPI ID, like name@okbank</span>
              )}
            </div>
          )}

          {method === 'card' && (
            <div className="mb-pay-card-form">
              <div className="mb-pay-field">
                <label htmlFor="cardnum">Card number</label>
                <input
                  id="cardnum"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => handleCardNumber(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="mb-pay-field">
                <label htmlFor="cardname">Name on card</label>
                <input
                  id="cardname"
                  type="text"
                  placeholder="As printed on the card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  autoComplete="off"
                />
              </div>
              <div className="mb-pay-row">
                <div className="mb-pay-field">
                  <label htmlFor="cardexp">Expiry</label>
                  <input
                    id="cardexp"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => handleExpiry(e.target.value)}
                    autoComplete="off"
                  />
                  {card.expiry.length === 5 && !expiryValid && (
                    <span className="mb-pay-error">Card has expired or the date is invalid</span>
                  )}
                </div>
                <div className="mb-pay-field">
                  <label htmlFor="cardcvv">CVV</label>
                  <input
                    id="cardcvv"
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) => handleCvv(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          className="mb-pay-confirm"
          onClick={confirmPayment}
          disabled={!canPay || processing}
        >
          {buttonLabel}
        </button>

        <button className="mb-pay-back" onClick={() => navigate('/order')}>
          Back to order
        </button>
      </section>
    </main>
  )
}