import type { AddAccount, AddAccountModel, Hasher, AccountModel, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { email, password } = accountData
    const hashedPassword = await this.hasher.hash(password)
    await this.loadAccountByEmailRepository.loadByEmail(email)
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
