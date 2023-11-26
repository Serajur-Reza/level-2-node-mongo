import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.validation'

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
}

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getSingleStudentFromDB(
      req.params.studentId,
    )

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
}

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.deleteStudentFromDB(
      req.params.studentId,
    )

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
}

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
}
