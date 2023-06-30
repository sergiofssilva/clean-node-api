import type { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import type { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import type { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import type { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModels, mockSurveyModel } from '@/domain/test'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(mockSurveyModels()) })
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => { resolve(mockSurveyModel()) })
    }
  }
  return new LoadSurveyByIdStub()
}
