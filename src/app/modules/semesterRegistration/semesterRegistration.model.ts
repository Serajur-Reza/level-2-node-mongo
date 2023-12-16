import { Schema, model } from 'mongoose'
import { TSemesterRegistration } from './semesterRegistration.interface'

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'ENDED'],
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      required: true,
      default: 3,
    },
    maxCredit: {
      type: Number,
      required: true,
      default: 16,
    },
  },
  {
    timestamps: true,
  },
)

export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
)
