import type {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokeRepository
} from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain/mocks'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return await Promise.resolve(true)
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub implements CheckAccountByEmailRepository {
    async checkByEmail (email: string): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new CheckAccountByEmailRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
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
