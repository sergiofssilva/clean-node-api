import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import type { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
