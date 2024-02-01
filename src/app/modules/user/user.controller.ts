import { NextFunction, Request, RequestHandler, Response } from 'express'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import AppError from '../../errors/AppError'

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body

  const result = await UserServices.createStudentintoDB(
    password,
    studentData,
    req.file,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student added successfully',
    data: result,
  })
})

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body

  const result = await UserServices.createFacultyintoDB(
    password,
    facultyData,
    req.file,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty added successfully',
    data: result,
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body

  console.log('creating admin')
  const result = await UserServices.createAdminintoDB(
    password,
    adminData,
    req.file,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin added successfully',
    data: result,
  })
})

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user

  const result = await UserServices.getMeFromDB(userId, role)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Found Myself successfully',
    data: result,
  })
})

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await UserServices.changeStatusFromDB(id, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status changed successfully',
    data: result,
  })
})

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
}
