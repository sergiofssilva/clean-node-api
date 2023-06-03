import type { Authentication } from './../../../domain/usecases/authentication'
import type { EmailValidator } from './../../protocols/email-validator'
import { badRequest, serverError, unauthorized } from './../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from './../../errors'
import type { HttpRequest, HttpResponse } from '../../protocols'
import type { Controller } from './../../protocols/controller'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { email, password } = body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
