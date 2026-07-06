import User from '../models/User.js'
import { dbMode } from '../middleware/config/db.js'
import { getMemoryUsersByRole } from '../middleware/config/storage.js'

export const getDoctors = async (_req, res) => {
    if (dbMode === 'memory') {
        const doctors = getMemoryUsersByRole('doctor').map(({ password, ...user }) => user)
        return res.json(doctors)
    }

    const doctors = await User.find({ role: 'doctor' }).select('-password')
    return res.json(doctors)
}

export const getPatients = async (_req, res) => {
    if (dbMode === 'memory') {
        const patients = getMemoryUsersByRole('patient').map(({ password, ...user }) => user)
        return res.json(patients)
    }

    const patients = await User.find({ role: 'patient' }).select('-password')
    return res.json(patients)
}
