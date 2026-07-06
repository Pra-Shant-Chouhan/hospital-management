import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { dbMode } from './config/db.js'
import { getMemoryUserById } from './config/storage.js'

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospital-secret')

        if (dbMode === 'memory') {
            const user = getMemoryUserById(decoded.id)
            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }
            req.user = user
            return next()
        }

        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}
