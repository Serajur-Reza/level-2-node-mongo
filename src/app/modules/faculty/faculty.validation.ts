import { z } from 'zod'

export const createNameValidationSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
})

export const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    faculty: z.object({
      name: createNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      designation: z.string(),
      dateOfBirth: z.string(),
      email: z.string(),
      contactNumber: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
      academicDepartment: z.string(),
    }),
  }),
})

export const updateNameValidationSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
})

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string().optional(),
      name: updateNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.date().optional(),
      email: z.string().email().optional(),
      contactNumber: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'])
        .optional(),
      presentAddess: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
})

export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
}
