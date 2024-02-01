import express from 'express'
import { FacultyControllers } from './faculty.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateFacultyValidationSchema } from './faculty.validation'
import auth from '../../middlewares/authValidator'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getAllFaculties,
)

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getSingleFaculty,
)

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
)

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  FacultyControllers.deleteFaculty,
)

export const FacultyRoutes = router
