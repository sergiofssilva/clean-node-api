import type { LoadAccountByTokenRepository, Decrypter } from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    let accessToken: string
    try {
      accessToken = await this.decrypter.decrypt(token)
    } catch (error) {
      return null
    }
    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
