import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload)
  return result
}

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find()
  return result
}

const getAcademicFacultyFromDB = async (payload: string) => {
  const result = await AcademicFaculty.findOne({ _id: payload })
  return result
}

const updateAcademicFacultyFromDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getAcademicFacultyFromDB,
  updateAcademicFacultyFromDB,
}
