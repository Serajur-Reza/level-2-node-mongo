import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseControllers } from './offeredCourses.controller'
import { OfferedCourseValidations } from './offeredCourses.validation'

const router = express.Router()

router.get('/', OfferedCourseControllers.getAllOfferedCoursesController)

router.get('/:id', OfferedCourseControllers.getSingleOfferedCoursesController)

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourseController,
)

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourseController,
)

router.delete('/:id', OfferedCourseControllers.deleteOfferedCourseController)

export const offeredCourseRoutes = router
