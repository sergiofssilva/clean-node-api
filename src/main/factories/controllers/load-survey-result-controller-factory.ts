import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result-controller'
import type { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/db-load-survey-result-factory'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
