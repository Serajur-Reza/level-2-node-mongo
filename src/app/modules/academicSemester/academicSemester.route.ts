import express from 'express'
import { academicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidations } from './academicSemester.validation'

const router = express.Router()

router.get('/', academicSemesterControllers.getAllAcademicSemesters)

router.get('/:id', academicSemesterControllers.getAcademicSemester)

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcedemicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
)

router.patch(
  '/:id',
  validateRequest(
    AcademicSemesterValidations.editAcedemicSemesterValidationSchema,
  ),
  academicSemesterControllers.editAcademicSemester,
)

export const AcademicSemesterRoutes = router
