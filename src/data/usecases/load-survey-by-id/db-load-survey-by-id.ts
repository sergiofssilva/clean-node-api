import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import type { SurveyModel } from '../load-surveys/db-load-surveys-protocols'
import type { LoadSurveyById } from '@/domain/usecases/load-surveys-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
