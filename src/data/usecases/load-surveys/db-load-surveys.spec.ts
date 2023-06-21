import { DbLoadSurveys } from './db-load-surveys'
import type { SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'
import MockDate from 'mockdate'

const makeLoadSurveyRepository = (): LoadSurveysRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(makeFakeSurveys()) })
    }
  }
  return new LoadSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveyRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepository()
  const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

const makeFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'first_id',
    question: 'first_question',
    answers: [{
      answer: 'first_answer',
      image: 'any_image'
    }],
    date: new Date()
  },
  {
    id: 'second_id',
    question: 'second_question',
    answers: [{
      answer: 'first_answer'
    }],
    date: new Date()
  }
])

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(makeFakeSurveys())
  })

  test('Should throw if AddSurveyRepository throw', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
