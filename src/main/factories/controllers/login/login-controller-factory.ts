import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import type { Controller } from '../../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validation-factory'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
