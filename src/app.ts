import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'
import { UserRoutes } from './app/modules/user/user.route'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'
import notFound from './app/middlewares/notFound'

const app: Application = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1', router)

app.get('/', async (req: Request, res: Response) => {
  Promise.reject()
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
