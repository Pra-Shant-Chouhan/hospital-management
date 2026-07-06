import express from 'express'
import { getDoctors, getPatients } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/doctors', protect, getDoctors)
router.get('/patients', protect, getPatients)

export default router
