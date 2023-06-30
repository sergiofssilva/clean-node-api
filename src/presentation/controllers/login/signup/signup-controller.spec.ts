import type { AddAccount, HttpRequest, Validation, Authentication } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors'
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'

const email = 'valid_email@mail.com'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const mockHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email,
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignUp Controller', () => {
  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const addSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockHttpRequest()
    const { body } = httpRequest
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any field'))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any field')))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email,
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null as any)))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null as any))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockHttpRequest())
    expect(authSpy).toBeCalledWith({
      email,
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
