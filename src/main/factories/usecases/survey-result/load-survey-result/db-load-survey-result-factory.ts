import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import type { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { DbLoadSurveyResult } from '@/data/usecases/db-load-survey-result'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
