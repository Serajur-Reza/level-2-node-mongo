import express from 'express'
import { studentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.validation'

const router = express.Router()

router.get('/', studentControllers.getAllStudents)

router.get('/:studentId', studentControllers.getSingleStudent)

// router.post('/create-student', studentControllers.createStudent)
router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),
  studentControllers.updateSingleStudent,
)

router.delete('/:studentId', studentControllers.deleteSingleStudent)

export const StudentRoutes = router
