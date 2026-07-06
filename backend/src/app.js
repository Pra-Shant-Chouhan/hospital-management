import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/appointments', appointmentRoutes)

export default app
