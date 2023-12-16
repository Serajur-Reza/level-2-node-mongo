import express from 'express'
import { SemesterRegistrationControllers } from './semesterRegistration.controller'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegistrationValidations } from './semesterRegistration.validation'

const router = express.Router()

router.get(
  '/',
  SemesterRegistrationControllers.getAllSemesterRegistrationController,
)

router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistrationController,
)
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistrationController,
)

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistrationController,
)

router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistrationController,
)

export const SemesterRegistrationRoutes = router
