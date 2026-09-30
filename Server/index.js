import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/order.js'
import comboRoutes from './routes/combo.js'
import notificationsRoutes from './routes/notification.js'
import rewardsRoutes from './routes/rewards.js'

dotenv.config()
const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/combo', comboRoutes)
app.use('/order', orderRoutes)
app.use('/notifications', notificationsRoutes)
app.use('/rewards', rewardsRoutes)
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))