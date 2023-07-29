import { makeLogControllerDecorator, makeDbLoadSurveys } from '@/main/factories'
import { LoadSurveysController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
