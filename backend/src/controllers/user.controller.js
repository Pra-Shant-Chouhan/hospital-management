import User from '../models/User.js'

export const getDoctors = async (req, res) => {
    const doctors = await User.find({ role: 'doctor' }).select('-password')
    return res.json(doctors)
}

export const getPatients = async (req, res) => {
    const patients = await User.find({ role: 'patient' }).select('-password')
    return res.json(patients)
}
