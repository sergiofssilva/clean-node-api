import type { AccountModel } from '../add-account/db-add-account-protocols'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import type { AuthenticationModel } from '../../../domain/usecases/authentication'
import type { HashComparer } from '../../protocols/criptography/hash-comparer'

describe('DbAuthentication Usecase', () => {
  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    loadHashComparerStub: HashComparer
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const loadHashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, loadHashComparerStub)
    return {
      sut,
      loadAccountByEmailRepositoryStub,
      loadHashComparerStub
    }
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return await new Promise(resolve => { resolve(makeFakeAccount()) })
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
      async compare (password: string, hash: string): Promise<boolean> {
        return await new Promise(resolve => { resolve(true) })
      }
    }
    return new HashComparerStub()
  }

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, loadHashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(loadHashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthentication().password, makeFakeAccount().password)
  })
})
