import type { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import type { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import type { SurveyResultModel } from '@/domain/models'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
