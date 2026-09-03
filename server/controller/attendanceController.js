import Attendance from '../models/Attendance.js'
import Employee from '../models/Employee.js'

const markAttendance = async (req, res) => {
  try {
    const { records } = req.body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid attendance records'
      })
    }

    const savedRecords = []
    const errors = []

    for (const record of records) {
      try {
        const { employeeId, date, status } = record

        if (!employeeId || !date || !status) {
          errors.push({
            employeeId,
            error: 'Missing required fields'
          })
          continue
        }

        // Parse the date to remove time component
        const attendanceDate = new Date(date)
        attendanceDate.setHours(0, 0, 0, 0)

        // Check if attendance already exists for this employee on this date
        const existingAttendance = await Attendance.findOne({
          employeeId: employeeId,
          date: {
            $gte: attendanceDate,
            $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
          }
        })

        if (existingAttendance) {
          // Update existing record
          existingAttendance.status = status
          await existingAttendance.save()
          savedRecords.push(existingAttendance)
        } else {
          // Create new record
          const attendance = new Attendance({
            employeeId,
            date: attendanceDate,
            status
          })
          await attendance.save()
          savedRecords.push(attendance)
        }
      } catch (error) {
        errors.push({
          employeeId: record.employeeId,
          error: error.message
        })
      }
    }

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      savedRecords,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error marking attendance:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mark attendance'
    })
  }
}

const getAttendanceReport = async (req, res) => {
  try {
    const { date, employeeId } = req.query

    const query = {}

    if (date) {
      const attendanceDate = new Date(date)
      attendanceDate.setHours(0, 0, 0, 0)
      query.date = {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }

    if (employeeId) {
      query.employeeId = employeeId
    }

    const attendance = await Attendance.find(query)
      .populate({
        path: 'employeeId',
        select: 'employeeId department userId',
        populate: [
          {
            path: 'department',
            select: 'dep_name'
          },
          {
            path: 'userId',
            select: 'name'
          }
        ]
      })
      .sort({ date: -1 })

    // Transform the data to include name at the top level for easier access
    const transformedAttendance = attendance.map(record => {
      const attendanceObj = record.toObject()
      attendanceObj.employeeId = {
        ...attendanceObj.employeeId,
        name: attendanceObj.employeeId?.userId?.name || 'N/A'
      }
      return attendanceObj
    })

    res.json({
      success: true,
      attendance: transformedAttendance
    })
  } catch (error) {
    console.error('Error fetching attendance report:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    const query = { employeeId }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId')
      .sort({ date: -1 })

    res.json({
      success: true,
      attendance
    })
  } catch (error) {
    console.error('Error fetching employee attendance:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export { markAttendance, getAttendanceReport, getEmployeeAttendance }
