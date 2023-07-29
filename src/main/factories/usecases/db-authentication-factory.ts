import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { DbAuthentication } from '@/data/usecases/db-authentication'
import env from '@/main/config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const secret = env.jwtSecret
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
