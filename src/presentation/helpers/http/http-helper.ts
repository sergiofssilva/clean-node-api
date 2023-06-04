import { ServerError, UnauthorizedError } from '../../errors'
import type { HttpResponse } from '../../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})
