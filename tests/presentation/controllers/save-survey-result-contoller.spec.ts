import { SaveSurveyResultController } from '@/presentation/controllers'
import type { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/tests/presentation/mocks'
import { throwError, mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 403 if a wrong answer is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_account_id'
    })
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = mockRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return a SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok(mockSurveyResultModel()))
  })
})
