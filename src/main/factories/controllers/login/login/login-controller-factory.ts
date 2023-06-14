import { makeLogControllerDecorator } from './../../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import type { Controller } from '../../../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
