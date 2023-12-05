import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { academicDepartmentControllers } from './academicDepartment.controller'
import { AcademicDepartmentValidation } from './academicDepartment.validation'

const router = express.Router()

router.get('/', academicDepartmentControllers.getAllAcademicDepartments)

router.get('/:id', academicDepartmentControllers.getAcademicDepartment)

router.post(
  '/create-academic-Department',
  // validateRequest(
  //   AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  // ),
  academicDepartmentControllers.createAcademicDepartment,
)

router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.editAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
