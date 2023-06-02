import type { Authentication } from './../../../domain/usecases/authentication'
import type { EmailValidator } from './../../protocols/email-validator'
import { badRequest, serverError } from './../../helpers/http-helper'
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
      if (!email) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
      }
      if (!password) {
        return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
      }
      if (!this.emailValidator.isValid(email)) {
        return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
      }
      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
