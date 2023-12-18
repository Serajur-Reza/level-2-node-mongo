import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { courseValidation } from './course.validation'
import { courseControllers } from './course.controller'
import auth from '../../middlewares/authValidator'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get('/', courseControllers.getAllCourses)

router.get('/:id', courseControllers.getSingleCourse)

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.createCourseValidationSchema),
  courseControllers.createCourse,
)

router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidation.facultiesWithCourseValidationSchema),
  courseControllers.assignFacultiesWithCourse,
)

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.facultiesWithCourseValidationSchema),
  courseControllers.removeFacultiesFromCourse,
)

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseControllers.updateCourse,
)

router.delete('/:id', auth(USER_ROLE.admin), courseControllers.deleteCourse)

export const CourseRoutes = router
