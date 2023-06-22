import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-acount-by-token'
import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import env from '@/main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const secret = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
