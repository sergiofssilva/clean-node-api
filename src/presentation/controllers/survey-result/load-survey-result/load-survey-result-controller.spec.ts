import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyResultController } from './load-survey-result-controller'
import type { LoadSurveyResult, HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const surveyId = 'any_survey_id'
const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId
  }
})

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockHttpRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockHttpRequest())
    expect(response).toEqual(ok(mockSurveyResultModel()))
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
