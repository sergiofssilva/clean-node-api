import { loginPath, surveyPath, signUpPath, surveyResultPath } from './paths/'

export default {
  '/signup': signUpPath,
  '/login': loginPath,
  '/survey': surveyPath,
  '/survey/{surveyId}/results': surveyResultPath
}
