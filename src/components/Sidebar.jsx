import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Order', to: '/order', icon: '🛍️' },
  { label: 'Pay', to: '/pay', icon: '💳' },
  { label: 'Rewards', to: '/rewards', icon: '⭐' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <nav className="mb-bottombar">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`mb-bottombar-link ${location.pathname === link.to ? 'mb-bottombar-active' : ''}`}
        >
          <span className="mb-bottombar-icon">{link.icon}</span>
          <span className="mb-bottombar-label">{link.label}</span>
        </Link>
      ))}
    </nav>
  )
}