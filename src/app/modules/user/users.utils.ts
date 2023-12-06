import { TAcedemicSemester } from '../academicSemester/academicSemester.interface'
import { Admin } from '../admin/admin.model'
import { Faculty } from '../faculty/faculty.model'
import { User } from './user.model'

export const generateStudentId = async (payload: TAcedemicSemester) => {
  let currentId = (0).toString()

  const lastStudentId = await findLastStudent()
  const lastStudentYear = lastStudentId?.substring(0, 4)
  const lastStudentCode = lastStudentId?.substring(4, 6)
  const currentSemesterCode = payload.code
  const currentSemesterYear = payload.year

  if (
    lastStudentId &&
    lastStudentCode === currentSemesterCode &&
    lastStudentYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6)
  } else {
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId
}

const findLastStudent = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()
  return lastStudent?.id ? lastStudent.id : undefined
}

const findLastAdmin = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()

  return lastAdmin?.id ? lastAdmin?.id : undefined
}

const findLastFaculty = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()

  return lastFaculty?.id ? lastFaculty?.id.substring(2) : undefined
}

export const generateAdminOrFacultyId = async (role: string) => {
  let currentId = (0).toString()
  let lastId
  if (role === 'A') {
    lastId = await findLastAdmin()
  } else {
    lastId = await findLastFaculty()
  }

  if (lastId) {
    currentId = lastId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  return `${role}-${incrementId}`
}
