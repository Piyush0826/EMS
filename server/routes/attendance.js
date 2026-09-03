import express from 'express'
import { markAttendance, getAttendanceReport, getEmployeeAttendance } from '../controller/attendanceController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Mark attendance
router.post('/mark', authMiddleware, markAttendance)

// Get attendance report by date
router.get('/report', authMiddleware, getAttendanceReport)

// Get employee attendance records
router.get('/employee/:employeeId', authMiddleware, getEmployeeAttendance)

export default router
