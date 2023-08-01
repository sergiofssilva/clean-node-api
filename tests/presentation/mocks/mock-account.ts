import type { Authentication, LoadAccountByToken, AddAccount } from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks'

export const mockAddAccount = (): AddAccount => {
  class AddAcountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return await Promise.resolve(true)
    }
  }
  return new AddAcountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return await Promise.resolve(mockAuthenticationModel())
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string): Promise<LoadAccountByToken.Result> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
