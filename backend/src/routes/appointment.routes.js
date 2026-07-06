import express from 'express'
import { bookAppointment, cancelAppointment, getAppointments } from '../controllers/appointment.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, bookAppointment)
router.put('/:id/cancel', protect, cancelAppointment)
router.get('/', protect, getAppointments)

export default router
