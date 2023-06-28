import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { type Router } from 'express'

export default (router: Router): void => {
  router.put('/survey/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}