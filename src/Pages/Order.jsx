import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Order.css'

export default function Order() {
  const { cart, setCart, total, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const [discountPercent, setDiscountPercent] = useState(0)
const [canRedeem, setCanRedeem] = useState(false)
const [useFree, setUseFree] = useState(false)
const [freeItemId, setFreeItemId] = useState('')


useEffect(() => {
  const token = localStorage.getItem('token')
  fetch(`${import.meta.env.VITE_API_URL}/rewards`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((r) => r.json())
    .then((d) => {
      setDiscountPercent(d.discountPercent || 0)
      setCanRedeem(d.pendingReward === 'free_item' && d.rewardRedeemed === false)
    })
    .catch(() => {})
}, [])

const FREE_ITEM_MAX = 250   // keep in sync with the server
const freeItem = cart.find((c) => String(c.id) === String(freeItemId))
const freeAmount = useFree && freeItem ? Math.min(freeItem.price, FREE_ITEM_MAX) : 0
const afterFree = total - freeAmount
const discountAmount = Math.round(afterFree * discountPercent) / 100
const finalTotal = afterFree - discountAmount
  // removeFromCart removes the whole line, so "−" goes through setCart instead
  function changeQty(item, delta) {
    if (item.qty + delta <= 0) {
      removeFromCart(item.id)
      return
    }
    setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + delta } : c)))
  }

  async function proceedToPay() {
    if (placing) return
    setPlacing(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
  items: cart.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
  freeItemName: useFree && freeItem ? freeItem.name : null
})
      })
      const data = await res.json()
      if (data.order?.id) {
        setCart([])
        navigate(`/pay/${data.order.id}`)
      } else {
  console.log('order error:', res.status, data)
  alert(data.error || 'Failed to create order. Please try again.')
}
    } catch (err) {
      alert('Could not reach the server. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="mb-order">
        <div className="mb-order-empty">
          <span className="mb-order-empty-icon" aria-hidden="true">☕</span>
          <h1>Your order is empty</h1>
          <p>Pick something from a counter, or let the AI suggest a combo.</p>
          <div className="mb-order-empty-actions">
            <button className="mb-order-btn mb-order-btn--gold" onClick={() => navigate('/')}>
              Browse counters
            </button>
            <button className="mb-order-btn mb-order-btn--ghost" onClick={() => navigate('/combo-finder')}>
              Find my combo
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mb-order">
      <header className="mb-order-head">
        <h1>Your Order</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} ready to go</p>
      </header>

      <div className="mb-order-layout">
        <ul className="mb-order-list">
          {cart.map((item) => (
            <li className="mb-order-row" key={item.id}>
              <img
                className="mb-order-photo"
                src={`/images/menu/${item.id}.jpg`}
                alt={item.name}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
              />

              <div className="mb-order-info">
                <h2>{item.name}</h2>
                <span className="mb-order-unit">₹{item.price} each</span>
              </div>

              <div className="mb-order-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                <button onClick={() => changeQty(item, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => changeQty(item, 1)} aria-label={`Add one ${item.name}`}>+</button>
              </div>

              <strong className="mb-order-line">₹{item.price * item.qty}</strong>
            </li>
          ))}
        </ul>
{canRedeem && (
  <div className="mb-order-free">
    <label>
      <input
        type="checkbox"
        checked={useFree}
        onChange={(e) => {
          setUseFree(e.target.checked)
          if (e.target.checked && !freeItemId) setFreeItemId(cart[0].id)
        }}
      />
      🎁 Redeem my free item
    </label>
    {useFree && (
      <select value={freeItemId} onChange={(e) => setFreeItemId(e.target.value)}>
        {cart.map((c) => (
          <option key={c.id} value={c.id}>{c.name} (₹{c.price})</option>
        ))}
      </select>
    )}
  </div>
)}

        <aside className="mb-order-summary">
          <h2>Summary</h2>
          <div className="mb-order-sum-row">
  <span>Items</span>
  <span>{itemCount}</span>
</div>
<div className="mb-order-sum-row"><span>Subtotal</span><span>₹{total}</span></div>
{freeAmount > 0 && (
  <div className="mb-order-sum-row"><span>Free item</span><span>-₹{freeAmount}</span></div>
)}
{discountPercent > 0 && (
  <div className="mb-order-sum-row">
    <span>Tier discount ({discountPercent}%)</span>
    <span>-₹{discountAmount.toFixed(2)}</span>
  </div>
)}
<div className="mb-order-sum-row mb-order-sum-total">
  <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
</div>

          <button
            className="mb-order-btn mb-order-btn--gold mb-order-pay"
            onClick={proceedToPay}
            disabled={placing}
          >
            {placing ? 'Placing order…' : 'Proceed to Pay'}
          </button>
          <button className="mb-order-clear" onClick={() => setCart([])}>
            Clear order
          </button>
        </aside>
      </div>
    </main>
  )
}