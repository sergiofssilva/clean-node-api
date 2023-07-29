import { makeSignUpValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/db-add-account-factory'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import type { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
