import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(
    req.query,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Semester found successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getAcademicSemester = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicSemesterServices.getAcademicSemesterFromDB(
    req.params.id,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester found successfully',
    data: result,
  })
})

const createAcademicSemester = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester added successfully',
    data: result,
  })
})

const editAcademicSemester = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicSemesterServices.editAcademicSemesterIntoDB(
    req.params.id,
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester added successfully',
    data: result,
  })
})

export const academicSemesterControllers = {
  getAllAcademicSemesters,
  getAcademicSemester,
  createAcademicSemester,
  editAcademicSemester,
}
