import { createMemoryAppointment, getMemoryAppointmentById, getMemoryAppointmentsForUser, cancelMemoryAppointment, seedDemoData } from '../middleware/config/storage.js'

export const bookAppointment = (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body
        const patient = req.user

        if (!doctorId || !appointmentDate) {
            return res.status(400).json({ message: 'Doctor and appointment date are required' })
        }

        seedDemoData()
        const appointmentDateTime = new Date(appointmentDate)
        if (Number.isNaN(appointmentDateTime.getTime()) || appointmentDateTime < new Date()) {
            return res.status(400).json({ message: 'Appointment date must be in the future' })
        }

        const existing = getMemoryAppointmentsForUser(doctorId, 'doctor').find(
            (item) => item.appointmentDate && new Date(item.appointmentDate).getTime() === appointmentDateTime.getTime(),
        )

        if (existing) {
            return res.status(400).json({ message: 'This slot is already booked' })
        }

        const appointment = createMemoryAppointment({
            doctor: doctorId,
            patient: patient._id,
            appointmentDate: appointmentDateTime,
        })

        return res.status(201).json({ message: 'Appointment Booked', appointment })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const cancelAppointment = (req, res) => {
    try {
        const appointment = cancelMemoryAppointment(req.params.id)
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' })
        }

        return res.json({ message: 'Appointment Cancelled', appointment })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAppointments = (req, res) => {
    try {
        const role = req.user.role
        const appointments = getMemoryAppointmentsForUser(req.user._id, role)
        return res.json(appointments)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
