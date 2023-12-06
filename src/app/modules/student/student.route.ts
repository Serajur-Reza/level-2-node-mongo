import express from 'express'
import { studentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.validation'

const router = express.Router()

router.get('/', studentControllers.getAllStudents)

router.get('/:id', studentControllers.getSingleStudent)

// router.post('/create-student', studentControllers.createStudent)
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  studentControllers.updateSingleStudent,
)

router.delete('/:id', studentControllers.deleteSingleStudent)

export const StudentRoutes = router
