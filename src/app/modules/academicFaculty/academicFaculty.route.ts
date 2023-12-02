import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { academicFacultyControllers } from './academicFaculty.controller'
import { AcademicFacultyValidation } from './academicFaculty.validation'

const router = express.Router()

router.get('/', academicFacultyControllers.getAllAcademicFaculties)

router.get('/:id', academicFacultyControllers.getAcademicFaculty)

router.post(
  '/create-academic-faculty',
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
