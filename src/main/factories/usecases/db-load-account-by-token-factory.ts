import { AccountMongoRepository } from '@/infra/db'
import { JwtAdapter } from '@/infra/criptography'
import { DbLoadAccountByToken } from '@/data/usecases'
import type { LoadAccountByToken } from '@/domain/usecases'
import env from '@/main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const secret = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
