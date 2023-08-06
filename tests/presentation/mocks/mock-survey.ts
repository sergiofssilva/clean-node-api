import type { AddSurvey, LoadSurveys, LoadSurveyById, CheckSurveyById } from '@/domain/usecases'
import { mockSurveyModels, mockSurveyModel } from '@/tests/domain/mocks'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (accountId: string): Promise<LoadSurveys.Result> {
      return Promise.resolve(mockSurveyModels())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<LoadSurveyById.Result> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdStub()
}
