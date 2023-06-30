import type { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultParams } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
