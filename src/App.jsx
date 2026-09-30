import { useState } from 'react'                      
import Layout from './Layout'
import Dashboard from './Pages/Dashboard'
import CategoryMenu from './Pages/CategoryMenu'
import ComboFinder from './Pages/ComboFinder'
import BeanBackground from './components/BeanBackground'
import Sidebar from './components/Sidebar'
import Login from './Pages/Login'
import Order from './Pages/Order'
import Pay from './Pages/Pay'
import './App.css'
import AccountPage from './Pages/AccountPage'
import RewardsPage from './Pages/RewardsPage'
import NotificationsPage from './Pages/NotificationsPage'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import SplashScreen from "./SplashScreen";

function App() {
  const location = useLocation()

  // ← ADD: show the splash only once per browser session
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('splashSeen')
  )

  const handleSplashDone = () => {                    // ← ADD
    sessionStorage.setItem('splashSeen', '1')
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}   {/* ← ADD */}

      <BeanBackground />
      <Sidebar />

      <div className="mb-main-content">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/combo-finder" element={<ComboFinder />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/menu/:slug" element={<CategoryMenu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/order" element={<Order />} />
            <Route path="/pay/:orderId" element={<Pay />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/pay" element={<Navigate to="/order" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App