import { LoadSurveysController } from '@/presentation/controllers'
import type { LoadSurveys } from '@/domain/usecases'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'
import { mockLoadSurveys } from '@/tests/presentation/mocks'
import { throwError, mockSurveyModels } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: 'any_account_id'
})

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok(mockSurveyModels()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
})
