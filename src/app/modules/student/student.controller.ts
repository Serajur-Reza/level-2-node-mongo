import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.validation'

const createStudent = async (req: Request, res: Response) => {
  try {
    //creating a schema with joi
    const { student: studentData } = req.body

    // data validation with joi
    // const { error, value } = studentValidationSchema.validate(studentData)

    // data validation with zod
    const zodParsedData = studentValidationSchema.parse(studentData)

    const result = await StudentServices.createStudentintoDB(zodParsedData)

    res.status(200).json({
      success: true,
      message: 'Student added successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message as string,
      error,
    })
    console.log(error)
  }
}

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message as string,
    })
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
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
    res.status(404).json({
      success: false,
      message: error.message as string,
    })
  }
}

const deleteSingleStudent = async (req: Request, res: Response) => {
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
    res.status(404).json({
      success: false,
      message: error.message as string,
    })
  }
}

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
}
