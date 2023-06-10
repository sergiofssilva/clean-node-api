import { ServerError, UnauthorizedError, ForbiddenError } from '../../errors'
import type { HttpResponse } from '../../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})
