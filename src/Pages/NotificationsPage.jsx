import { useOutletContext } from 'react-router-dom'

function NotificationsPage() {
  const { notifications, setNotifications } = useOutletContext()

  function markAsRead(id) {
    const notif = notifications.find(n => n.id === id)
    if (notif.is_read) return

fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setNotifications(prev => prev.map(n => {
          if (n.id === id) {
            return { ...n, is_read: true }
          }
          return n
        }))
      })
  }

  return (
    <div className="mb-notif-page">
      <h1>Notifications</h1>

      {notifications.map(n => (
        <div
          key={n.id}
          className={`mb-notif-item ${!n.is_read ? 'unread' : ''}`}
          onClick={() => markAsRead(n.id)}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>
          <small>{new Date(n.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  )
}

export default NotificationsPage