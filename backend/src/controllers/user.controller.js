import { getMemoryUsersByRole } from '../middleware/config/storage.js'

export const getDoctors = (req, res) => {
    const doctors = getMemoryUsersByRole('doctor')
    return res.json(doctors)
}

export const getPatients = (req, res) => {
    const patients = getMemoryUsersByRole('patient')
    return res.json(patients)
}
