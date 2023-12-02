import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import { AcademicDepartmentServices } from './academicDepartment.service'

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Department found successfully',
    data: result,
  })
})

const getAcademicDepartment = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await AcademicDepartmentServices.getAcademicDepartmentFromDB(
    req.params.id,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department found successfully',
    data: result,
  })
})

const createAcademicDepartment = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department added successfully',
    data: result,
  })
})

const editAcademicDepartment = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentFromDB(
      req.params.id,
      req.body,
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department edited successfully',
    data: result,
  })
})

export const academicDepartmentControllers = {
  getAllAcademicDepartments,
  getAcademicDepartment,
  createAcademicDepartment,
  editAcademicDepartment,
}
