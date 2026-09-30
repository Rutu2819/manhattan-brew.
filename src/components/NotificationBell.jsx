import { Link } from 'react-router-dom'

function NotificationBell({ notifications }) {
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <Link to="/notifications" className="mb-bell">
      🔔
      {unreadCount > 0 && <span className="mb-bell-badge">{unreadCount}</span>}
    </Link>
  )
}

export default NotificationBell