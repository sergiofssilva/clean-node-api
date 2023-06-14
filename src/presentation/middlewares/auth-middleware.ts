import { forbidden } from './../helpers/http/http-helper'
import type { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => { resolve(forbidden(new AccessDeniedError())) })
  }
}
