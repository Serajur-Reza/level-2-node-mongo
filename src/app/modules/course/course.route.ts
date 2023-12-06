import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { courseValidation } from './course.validation'
import { courseControllers } from './course.controller'

const router = express.Router()

router.get('/', courseControllers.getAllCourses)

router.get('/:id', courseControllers.getSingleCourse)

router.post(
  '/create-course',
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
  validateRequest(courseValidation.facultiesWithCourseValidationSchema),
  courseControllers.removeFacultiesFromCourse,
)

router.patch(
  '/:id',
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseControllers.updateCourse,
)

router.delete('/:id', courseControllers.deleteCourse)

export const CourseRoutes = router
