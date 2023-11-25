import express from 'express'
import { studentControllers } from './student.controller'

const router = express.Router()

router.get('/', studentControllers.getAllStudents)

router.get('/:studentId', studentControllers.getSingleStudent)

router.post('/create-student', studentControllers.createStudent)

router.delete('/:studentId', studentControllers.deleteSingleStudent)

export const StudentRoutes = router
