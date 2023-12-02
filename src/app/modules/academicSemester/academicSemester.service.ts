import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { academicSemesterNameCodeMapper } from './academicSemester.constants'
import { TAcedemicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find()
  return result
}

const getAcademicSemesterFromDB = async (payload: string) => {
  const result = await AcademicSemester.findOne({ _id: payload })
  return result
}

const createAcademicSemesterIntoDB = async (payload: TAcedemicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code')
  }
  const result = await AcademicSemester.create(payload)
  return result
}

const editAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcedemicSemester>,
) => {
  if (
    payload.code &&
    payload.name &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code')
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

export const AcademicSemesterServices = {
  getAllAcademicSemestersFromDB,
  getAcademicSemesterFromDB,
  createAcademicSemesterIntoDB,
  editAcademicSemesterIntoDB,
}
