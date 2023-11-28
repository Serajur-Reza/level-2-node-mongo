import { model, Schema } from 'mongoose'
import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcedemicSemester,
  TMonths,
} from './academicSemester.interface'
import {
  academicSemesterCode,
  academicSemesterName,
  months,
} from './academicSemester.constants'

const academicSemesterSchema = new Schema<TAcedemicSemester>(
  {
    name: { type: String, required: true, enum: academicSemesterName },
    year: { type: String, required: true },
    code: { type: String, required: true, enum: academicSemesterCode },
    startMonth: {
      type: String,
      enum: months,
    },
    endMonth: {
      type: String,
      enum: months,
    },
  },
  {
    timestamps: true,
  },
)

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  })
  if (isSemesterExists) {
    throw new Error('Semester already exists')
  }
  next()
})

export const AcademicSemester = model<TAcedemicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)
