import config from '../../config'
import { TAcedemicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { NewUser, TUser } from './user.interface'
import { User } from './user.model'
import generateStudentId from './users.utils'

const createStudentintoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}
  userData.password = password || (config.default_password as string)
  userData.role = 'student'

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new Error('Semester does not exist')
  }
  userData.id = await generateStudentId(admissionSemester)

  //create a user
  const result = await User.create(userData) // built in static method

  //create a student
  if (Object.keys(result).length) {
    // set _id as user
    payload.id = result.id
    payload.user = result._id

    const newStudent = await Student.create(payload)
    return newStudent
  }

  return result
}

export const UserServices = {
  createStudentintoDB,
}
