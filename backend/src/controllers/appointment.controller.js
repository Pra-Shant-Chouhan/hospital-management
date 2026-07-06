import Appointment from '../models/Appointment.js'
import User from '../models/User.js'
import { dbMode } from '../middleware/config/db.js'
import { cancelMemoryAppointment, createMemoryAppointment, getMemoryAppointmentById, getMemoryAppointmentsForUser, getMemoryUserById, memoryStore, seedDemoData } from '../middleware/config/storage.js'

const formatAppointment = (appointment) => {
    const appointmentObject = appointment.toObject ? appointment.toObject() : appointment

    const doctor = appointmentObject.doctor?.name
        ? appointmentObject.doctor
        : (typeof appointmentObject.doctor === 'string' ? getMemoryUserById(appointmentObject.doctor) : appointmentObject.doctor)

    const patient = appointmentObject.patient?.name
        ? appointmentObject.patient
        : (typeof appointmentObject.patient === 'string' ? getMemoryUserById(appointmentObject.patient) : appointmentObject.patient)

    return {
        ...appointmentObject,
        doctorName: doctor?.name || 'Unknown doctor',
        patientName: patient?.name || 'Unknown patient',
        doctor,
        patient,
    }
}

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body
        const patient = req.user

        if (!doctorId || !appointmentDate) {
            return res.status(400).json({ message: 'Doctor and appointment date are required' })
        }

        const appointmentDateTime = new Date(appointmentDate)
        if (Number.isNaN(appointmentDateTime.getTime()) || appointmentDateTime < new Date()) {
            return res.status(400).json({ message: 'Appointment date must be in the future' })
        }

        if (dbMode === 'memory') {
            seedDemoData()
            const doctor = getMemoryUserById(doctorId)
            if (!doctor || doctor.role !== 'doctor') {
                return res.status(404).json({ message: 'Doctor not found' })
            }

            const existing = memoryStore.appointments.find((appointment) => appointment.doctor?.toString() === doctorId && new Date(appointment.appointmentDate).getTime() === appointmentDateTime.getTime())
            if (existing) {
                return res.status(400).json({ message: 'This slot is already booked' })
            }

            const appointment = createMemoryAppointment({
                doctor: doctorId,
                patient: patient._id,
                appointmentDate: appointmentDateTime,
            })

            return res.status(201).json({ message: 'Appointment Booked', appointment: formatAppointment(appointment) })
        }

        const doctor = await User.findById(doctorId)
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' })
        }

        const existing = await Appointment.findOne({ doctor: doctorId, appointmentDate: appointmentDateTime })
        if (existing) {
            return res.status(400).json({ message: 'This slot is already booked' })
        }

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: patient._id,
            appointmentDate: appointmentDateTime,
        })

        const populatedAppointment = await appointment.populate([{ path: 'doctor', select: 'name specialization' }, { path: 'patient', select: 'name role' }])
        return res.status(201).json({ message: 'Appointment Booked', appointment: formatAppointment(populatedAppointment) })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const cancelAppointment = async (req, res) => {
    try {
        if (dbMode === 'memory') {
            seedDemoData()
            const appointment = cancelMemoryAppointment(req.params.id)
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' })
            }
            return res.json({ message: 'Appointment Cancelled', appointment: formatAppointment(appointment) })
        }

        const appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' })
        }

        appointment.status = 'Cancelled'
        await appointment.save()

        const populatedAppointment = await appointment.populate([{ path: 'doctor', select: 'name specialization' }, { path: 'patient', select: 'name role' }])
        return res.json({ message: 'Appointment Cancelled', appointment: formatAppointment(populatedAppointment) })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAppointments = async (req, res) => {
    try {
        if (dbMode === 'memory') {
            seedDemoData()
            const appointments = getMemoryAppointmentsForUser(req.user._id, req.user.role)
            return res.json(appointments.map(formatAppointment))
        }

        const query = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id }
        const appointments = await Appointment.find(query).sort({ appointmentDate: 1 }).populate([{ path: 'doctor', select: 'name specialization' }, { path: 'patient', select: 'name role' }])

        return res.json(appointments.map(formatAppointment))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
