import { forbidden, ok } from './../helpers/http/http-helper'
import type { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import type { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return ok(account)
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
