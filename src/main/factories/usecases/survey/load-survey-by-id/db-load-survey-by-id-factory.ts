import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import type { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}