import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

type ErrorMessages = {
  path: string | number
  message: string
}[]

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('exception: ', exception)

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception.message || 'Internal server error'
    const errorMessages: ErrorMessages = []
    const stack = exception.stack

    // TODO: Implement the required logic in this section. [future]

    errorMessages.push({
      path: '',
      message
    })

    const errorResponse = {
      status,
      message,
      errorMessages,
      stack,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`${request.method} ${request.url}`, exception.stack, 'ExceptionFilter')
    } else {
      Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter')
    }

    const error = {
      success: false,
      status,
      message: errorResponse.message || '',
      errorMessages,
      stack
    }

    response.status(status).json(error)
  }
}
