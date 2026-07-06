import bcrypt from 'bcrypt'
import { createMemoryUser, getMemoryUserByEmail, seedDemoData } from '../middleware/config/storage.js'
import { generateToken } from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, specialization } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide name, email, password and role' })
        }

        if (role === 'doctor' && !specialization) {
            return res.status(400).json({ message: 'Specialization is required for doctors' })
        }

        seedDemoData()
        const existingUser = getMemoryUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = createMemoryUser({
            name,
            email,
            password: hashedPassword,
            role,
            specialization: role === 'doctor' ? specialization : undefined,
        })

        const token = generateToken(user)
        return res.status(201).json({ token, user: { _id: user._id, name: user.name, role: user.role } })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        seedDemoData()
        const user = getMemoryUserByEmail(email)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user)
        return res.json({ token, user: { _id: user._id, name: user.name, role: user.role } })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
