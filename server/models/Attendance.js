import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave', 'sick'],
      default: 'present'
    }
  },
  { timestamps: true }
)

// Create a compound index for unique attendance per employee per date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance
