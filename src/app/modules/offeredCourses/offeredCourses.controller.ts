import { Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../middlewares/catchAsync'
import { OfferedCourseServices } from './offeredCourses.service'

const createOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
      req.body,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course is created successfully !',
      data: result,
    })
  },
)

const getAllOfferedCoursesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
      req.query,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Courses are retrieved successfully !',
      data: result,
    })
  },
)

const getSingleOfferedCoursesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.getSingleOfferedCoursesIntoDB(
      req.params.id,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course is retrieved successfully !',
      data: result,
    })
  },
)

const updateOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
      req.params.id,
      req.body,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course is updated successfully !',
      data: result,
    })
  },
)

const deleteOfferedCourseController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseServices.deleteOfferedCourseIntoDB(
      req.params.id,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course is deleted successfully !',
      data: result,
    })
  },
)

export const OfferedCourseControllers = {
  createOfferedCourseController,
  getAllOfferedCoursesController,
  getSingleOfferedCoursesController,
  updateOfferedCourseController,
  deleteOfferedCourseController,
}
