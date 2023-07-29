import { makeAddSurveyValidation, makeLogControllerDecorator } from '@/main/factories'
import { makeDbAddSurvey } from '@/main/factories/usecases/db-add-survey-factory'
import { AddSurveyController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
