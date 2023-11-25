import Joi from 'joi'

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-zA-Z]*$/, { name: 'capitalized' })
    .required()
    .messages({
      'string.base': 'firstName must be a string',
      'string.empty': 'firstName is required',
      'string.max': 'firstName cannot be more than 20 characters',
      'any.required': 'firstName is missing',
      'string.pattern.base': 'firstName must be in capitalized format',
    }),
  middleName: Joi.string().allow('').optional(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.base': 'lastName must be a string',
      'string.empty': 'lastName is required',
      'any.required': 'lastName is missing',
      'string.pattern.base': 'lastName must contain only alphabetic characters',
    }),
})

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.base': 'fatherName must be a string',
    'string.empty': 'fatherName is required',
    'any.required': 'fatherName is missing',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.base': 'fatherOccupation must be a string',
    'string.empty': 'fatherOccupation is required',
    'any.required': 'fatherOccupation is missing',
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.base': 'fatherContactNo must be a string',
    'string.empty': 'fatherContactNo is required',
    'any.required': 'fatherContactNo is missing',
  }),
  motherName: Joi.string().required().messages({
    'string.base': 'motherName must be a string',
    'string.empty': 'motherName is required',
    'any.required': 'motherName is missing',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.base': 'motherOccupation must be a string',
    'string.empty': 'motherOccupation is required',
    'any.required': 'motherOccupation is missing',
  }),
  motherContactNo: Joi.string().required().messages({
    'string.base': 'motherContactNo must be a string',
    'string.empty': 'motherContactNo is required',
    'any.required': 'motherContactNo is missing',
  }),
})

const localguardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'name must be a string',
    'string.empty': 'name is required',
    'any.required': 'name is missing',
  }),
  occupation: Joi.string().required().messages({
    'string.base': 'occupation must be a string',
    'string.empty': 'occupation is required',
    'any.required': 'occupation is missing',
  }),
  contactNo: Joi.string().required().messages({
    'string.base': 'contactNo must be a string',
    'string.empty': 'contactNo is required',
    'any.required': 'contactNo is missing',
  }),
  address: Joi.string().required().messages({
    'string.base': 'address must be a string',
    'string.empty': 'address is required',
    'any.required': 'address is missing',
  }),
})

const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'id must be a string',
    'string.empty': 'id is required',
    'any.required': 'id is missing',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'name is missing',
  }),
  gender: Joi.string().valid('male', 'female').required().messages({
    'any.only': 'gender must be either "male" or "female"',
    'any.required': 'gender is missing',
  }),
  dateOfBirth: Joi.string().allow('').optional().messages({
    'string.base': 'dateOfBirth must be a string',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'email must be a string',
    'string.empty': 'email is required',
    'string.email': 'email must be a valid email address',
    'any.required': 'email is missing',
  }),
  contactNumber: Joi.string().allow('').optional().messages({
    'string.base': 'contactNumber must be a string',
  }),
  emergencyContactNo: Joi.string().allow('').optional().messages({
    'string.base': 'emergencyContactNo must be a string',
  }),
  bloodGroup: Joi.string()
    .valid('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')
    .required()
    .messages({
      'any.only': 'bloodGroup must be one of: O+, O-, A+, A-, B+, B-, AB+, AB-',
      'any.required': 'bloodGroup is missing',
    }),
  presentAddress: Joi.string().allow('').optional().messages({
    'string.base': 'presentAddress must be a string',
  }),
  permanentAddress: Joi.string().allow('').optional().messages({
    'string.base': 'permanentAddress must be a string',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'guardian is missing',
  }),
  localGuardian: localguardianValidationSchema.required().messages({
    'any.required': 'localGuardian is missing',
  }),
  profileImg: Joi.string().required().messages({
    'string.base': 'profileImg must be a string',
    'string.empty': 'profileImg is required',
    'any.required': 'profileImg is missing',
  }),
  active: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': 'active must be either "active" or "blocked"',
  }),
})

export default studentValidationSchema
