import { Model, Types } from 'mongoose'

export type TName = {
  firstName: string
  middleName: string
  lastName: string
}

export type TAdmin = {
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
  isDeleted: boolean
}

export interface AdminModel extends Model<TAdmin> {
  isUserExists(id: string): Promise<TAdmin | null>
}
