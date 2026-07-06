import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
    {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        appointmentDate: { type: Date, required: true },
        status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' },
    },
    { timestamps: true },
)

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment
