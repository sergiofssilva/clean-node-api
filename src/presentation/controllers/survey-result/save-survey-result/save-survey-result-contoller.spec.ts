import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-contoller'
import type { LoadSurveyById, SurveyModel, SaveSurveyResultModel, HttpRequest } from './save-survey-result-contoller-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => { resolve(makeFakeSurvey()) })
    }
  }
  return new LoadSurveyByIdStub()
}

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'param_id'
  },
  body: makeFakeSurveyResultData()
})

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

describe('SaveSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('param_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
