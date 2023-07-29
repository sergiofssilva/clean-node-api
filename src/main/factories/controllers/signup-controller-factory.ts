import { makeSignUpValidation, makeLogControllerDecorator, makeDbAuthentication, makeDbAddAccount } from '@/main/factories'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import type { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
