import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters'
import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories'
import { type Router } from 'express'

export default (router: Router): void => {
  router.put('/survey/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/survey/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
