import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { academicFacultyControllers } from './academicFaculty.controller'
import { AcademicFacultyValidation } from './academicFaculty.validation'
import auth from '../../middlewares/authValidator'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get('/', academicFacultyControllers.getAllAcademicFaculties)

router.get('/:id', academicFacultyControllers.getAcademicFaculty)

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
)

router.patch(
  '/:id',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.editAcademicFaculty,
)

export const AcademicFacultyRoutes = router
