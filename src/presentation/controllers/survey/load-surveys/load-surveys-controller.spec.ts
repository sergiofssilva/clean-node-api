import type { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import MockDate from 'mockdate'

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(makeFakeSurveys()) })
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
