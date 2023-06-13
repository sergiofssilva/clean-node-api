import { AddSurveyController } from './../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeDbAddSurvey } from './../../usecases/add-survey/db-add-survey-factory'
import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import type { Controller } from './../../../../presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
