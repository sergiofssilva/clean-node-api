import type { LoadAccountByEmailRepository } from './../../protocols/db/load-account-by-email-repository'
import type { Authentication, AuthenticationModel } from './../../../domain/usecases/authentication'
import type { HashComparer } from '../../protocols/criptography/hash-comparer'
import type { TokenGenerator } from '../../protocols/criptography/token-generator'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const { id, password } = account
      const match = await this.hashComparer.compare(authentication.password, password)
      if (match) {
        const tokenAccess = await this.tokenGenerator.generate(id)
        return tokenAccess
      }
    }
    return null
  }
}
