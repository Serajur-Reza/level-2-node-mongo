import { Model, Types } from 'mongoose'

export type TName = {
  firstName: string
  middleName: string
  lastName: string
}

export type TFaculty = {
  id: string
  user: Types.ObjectId
  designation: string
  name: TName
  gender: 'male' | 'female' | 'other'
  dateOfBirth: Date
  email: string
  contactNumber: string
  emergencyContactNo: string
  bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  academicDepartment: Types.ObjectId
  academicFaculty: Types.ObjectId
  isDeleted: boolean
}

export interface FacultyModel extends Model<TFaculty> {
  isUserExists(id: string): Promise<TFaculty | null>
}
