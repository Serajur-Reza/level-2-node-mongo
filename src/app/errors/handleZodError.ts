import { ZodError } from 'zod'
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interface/err.interface'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map(issue => {
    return {
      path: issue?.path[issue?.path.length - 1],
      message: issue.message,
    }
  })

  const statusCode = 400
  return {
    statusCode,
    message: 'validation error',
    errorSources,
  }
}

export default handleZodError
