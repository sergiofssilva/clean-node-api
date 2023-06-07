
import { LogControllerDecorator } from './../../decorators/log-controller-decorator'
import { AccountMongoRepository } from './../../../infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from './../../../infra/criptography/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from './../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LoginController } from './../../../presentation/controllers/login/login-controller'
import type { Controller } from './../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validation-factory'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import env from '../../config/env'

export const makeLoginFactory = (): Controller => {
  const salt = 12
  const secret = env.jwtSecret
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(authentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
