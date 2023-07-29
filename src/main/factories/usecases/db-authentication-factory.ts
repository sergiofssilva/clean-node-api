import { JwtAdapter, BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db'
import { DbAuthentication } from '@/data/usecases'
import env from '@/main/config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const secret = env.jwtSecret
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
