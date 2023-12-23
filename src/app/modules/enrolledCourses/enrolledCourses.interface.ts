import { Types } from 'mongoose'

export type TGrades = 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A'

export type TEnrolledCourseMarks = {
  classTest1: number
  midTerm: number
  classTest2: number
  finalTerm: number
}

export type TEnrolledCourses = {
  semesterRegistration: Types.ObjectId
  academicSemester: Types.ObjectId
  academicFaculty: Types.ObjectId
  academicDepartment: Types.ObjectId
  offeredCourse: Types.ObjectId
  course: Types.ObjectId
  student: Types.ObjectId
  faculty: Types.ObjectId
  isEnrolled: boolean
  courseMarks: TEnrolledCourseMarks
  grade: TGrades
  gradePoints: number
  isCompleted: boolean
}
