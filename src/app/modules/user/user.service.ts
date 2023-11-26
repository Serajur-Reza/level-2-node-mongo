import config from '../../config'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { NewUser, TUser } from './user.interface'
import { User } from './user.model'

const createStudentintoDB = async (password: string, studentData: TStudent) => {
  const userData: Partial<TUser> = {}
  userData.password = password || (config.default_password as string)
  userData.role = 'student'
  userData.id = '2030100001'

  //create a user
  const result = await User.create(userData) // built in static method

  //create a student
  if (Object.keys(result).length) {
    // set _id as user
    studentData.id = result.id
    studentData.user = result._id

    const newStudent = await Student.create(studentData)
    return newStudent
  }

  // const student = new Student(studentData)
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('user already exists')
  // }
  // const result = await student.save() // built in instance method
  return result
}

export const UserServices = {
  createStudentintoDB,
}
