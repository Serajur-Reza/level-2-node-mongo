import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { SemesterRegistrationServices } from './semesterRegistration.service'

const createSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
        req.body,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration created successfully',
      data: result,
    })
  },
)

const getAllSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
        req.query,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semesters Retrieved successfully',
      meta: result.meta,
      data: result.result,
    })
  },
)

const getSingleSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.getSingleSemesterRegistrationsFromDB(
        req.params.id,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester is Retrieved successfully',
      data: result,
    })
  },
)

const updateSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
        req.params.id,
        req.body,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration updated successfully',
      data: result,
    })
  },
)

const deleteSemesterRegistrationController = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.deleteSemesterRegistrationIntoDB(
        req.params.id,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration deleted successfully',
      data: result,
    })
  },
)

export const SemesterRegistrationControllers = {
  createSemesterRegistrationController,
  getAllSemesterRegistrationController,
  getSingleSemesterRegistrationController,
  updateSemesterRegistrationController,
  deleteSemesterRegistrationController,
}
