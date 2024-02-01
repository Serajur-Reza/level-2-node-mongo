import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import { AcademicFacultyServices } from './academicFaculty.service'

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB(
    req.query,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Faculty found successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getAcademicFaculty = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicFacultyServices.getAcademicFacultyFromDB(
    req.params.id,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty found successfully',
    data: result,
  })
})

const createAcademicFaculty = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty added successfully',
    data: result,
  })
})

const editAcademicFaculty = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicFacultyServices.updateAcademicFacultyFromDB(
    req.params.id,
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty edited successfully',
    data: result,
  })
})

export const academicFacultyControllers = {
  getAllAcademicFaculties,
  getAcademicFaculty,
  createAcademicFaculty,
  editAcademicFaculty,
}
