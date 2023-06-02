import { badRequest } from './../../helpers/http-helper'
import { MissingParamError } from './../../errors/missing-param-error'
import type { HttpRequest, HttpResponse } from '../../protocols'
import type { Controller } from './../../protocols/controller'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!httpRequest.body.password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }
  }
}
