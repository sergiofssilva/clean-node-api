import type { AccountModel, AddAccountParams } from '@/data/usecases/account/add-account/db-add-account-protocols'
import type { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import type { UpdateAccessTokeRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { mockAccountModel } from '@/domain/test'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokeRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokeRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}
