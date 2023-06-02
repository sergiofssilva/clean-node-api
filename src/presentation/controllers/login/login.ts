import { badRequest } from './../../helpers/http-helper'
import { MissingParamError } from './../../errors/missing-param-error'
import type { HttpRequest, HttpResponse } from '../../protocols'
import type { Controller } from './../../protocols/controller'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const resp = badRequest(new MissingParamError('email'))
    return await new Promise(resolve => { resolve(resp) })
  }
}
