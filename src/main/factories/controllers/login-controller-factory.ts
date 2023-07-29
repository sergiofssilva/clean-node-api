import { makeLoginValidation, makeLogControllerDecorator, makeDbAuthentication } from '@/main/factories'
import { LoginController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
