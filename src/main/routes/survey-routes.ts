import { auth, adminAuth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadSurveysController, makeAddSurveyController } from '@/main/factories'
import { type Router } from 'express'

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/survey', auth, adaptRoute(makeLoadSurveysController()))
}
