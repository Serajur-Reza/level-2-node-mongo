import express from 'express'
import { academicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidations } from './academicSemester.validation'
import { USER_ROLE } from '../user/user.constant'
import auth from '../../middlewares/authValidator'

const router = express.Router()

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  academicSemesterControllers.getAllAcademicSemesters,
)

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  academicSemesterControllers.getAcademicSemester,
)

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicSemesterValidations.createAcedemicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
)

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicSemesterValidations.editAcedemicSemesterValidationSchema,
  ),
  academicSemesterControllers.editAcademicSemester,
)

export const AcademicSemesterRoutes = router
