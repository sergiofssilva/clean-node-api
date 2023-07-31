import type { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password } = accountData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(password)
      const newAccount = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword
      })
      return newAccount
    }
    return null
  }
}
