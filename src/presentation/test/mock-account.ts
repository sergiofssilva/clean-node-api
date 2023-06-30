import type { AddAccountParams, AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import type { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import type { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import type { AddAccount } from '@/domain/usecases/account/add-account'
import { mockAccountModel } from '@/domain/test/mock-account'

export const mockAddAccount = (): AddAccount => {
  class AddAcountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new AddAcountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
