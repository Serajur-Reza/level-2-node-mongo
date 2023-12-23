import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { enrolledCoursesValidations } from './enrolledCourses.validation'
import { EnrolledCoursesControllers } from './enrolledCourses.controller'
import auth from '../../middlewares/authValidator'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.student),
  // validateRequest(
  //   enrolledCoursesValidations.createEnrolledCourseValidationSchema,
  // ),
  EnrolledCoursesControllers.getAllEnrolledCourses,
)

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    enrolledCoursesValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCoursesControllers.createEnrolledCourse,
)

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(
    enrolledCoursesValidations.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrolledCoursesControllers.updateEnrolledCourseMarks,
)

export const EnrolledCoursesRoutes = router
