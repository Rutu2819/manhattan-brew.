import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import NotificationBell from './Components/NotificationBell'

export default function Layout() {
  const location = useLocation()
  const isSubpage = location.pathname !== '/'

  // PART 1: the state, above the return
  const [notifications, setNotifications] = useState([])

  // PART 2: the fetch, also above the return
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        setNotifications(data.notifications || [])
      })
  }, [location.pathname])

  // there is only ONE return, and it holds only the page markup
  return (
    <div>
      <header className="mb-header">
        <Link to="/" className="mb-brand">
          <span className="mb-brand-icon">☕</span>
          <span className="mb-brand-word">
            MANHATTAN <em>BREW</em>
          </span>
        </Link>
        {isSubpage && (
          <Link to="/" className="mb-back-btn">
            ← Back to Dashboard
          </Link>
        )}
        <div className="mb-header-right">
          <Link to="/account" className="mb-header-account">
            Account
          </Link>

          {/* PART 3: the bell gets the list as a prop */}
          <NotificationBell notifications={notifications} />

          <Link to="/order" className="mb-header-cart">
            🛍️
          </Link>
        </div>
      </header>

      {/* PART 4: the pages get the list and the setter through Outlet */}
      <Outlet context={{ notifications, setNotifications }} />
    </div>
  )
}