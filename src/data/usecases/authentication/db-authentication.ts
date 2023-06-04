import type { LoadAccountByEmailRepository } from './../../protocols/db/load-account-by-email-repository'
import type { Authentication, AuthenticationModel } from './../../../domain/usecases/authentication'
import type { HashComparer } from '../../protocols/criptography/hash-comparer'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const { password } = account
      await this.hashComparer.compare(authentication.password, password)
    }
    return null
  }
}
