import { auth, adminAuth } from './../middlewares'
import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveysController } from './../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/survey', auth, adaptRoute(makeLoadSurveysController()))
}
