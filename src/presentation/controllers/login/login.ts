import type { EmailValidator } from './../../protocols/email-validator'
import { badRequest } from './../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from './../../errors'
import type { HttpRequest, HttpResponse } from '../../protocols'
import type { Controller } from './../../protocols/controller'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const { email, password } = body
    if (!email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }
    if (!this.emailValidator.isValid(email)) {
      return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
    }
  }
}
