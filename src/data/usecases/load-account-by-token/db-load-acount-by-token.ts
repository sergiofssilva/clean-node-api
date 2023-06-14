import type { Decrypter } from './../../protocols/criptography/decrypter'
import type { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import type { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(token)
    return null
  }
}
