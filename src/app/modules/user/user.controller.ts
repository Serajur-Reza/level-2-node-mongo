import { NextFunction, Request, Response } from 'express'
import { UserServices } from './user.service'

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //creating a schema with joi
    const { password, student: studentData } = req.body

    // data validation with joi
    // const { error, value } = studentValidationSchema.validate(studentData)

    // data validation with zod
    // const zodParsedData = studentValidationSchema.parse(studentData)

    const result = await UserServices.createStudentintoDB(password, studentData)

    res.status(200).json({
      success: true,
      message: 'Student added successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const userControllers = {
  createStudent,
}
