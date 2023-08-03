import type { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols'
import type { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password } = accountData
    const account = await this.checkAccountByEmailRepository.checkByEmail(email)
    let isValid = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(password)
      isValid = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword
      })
    }
    return isValid
  }
}
