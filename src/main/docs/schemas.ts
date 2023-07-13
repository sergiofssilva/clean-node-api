import { accountSchema, signUpParamsSchema, loginParamsSchema, surveyParamsSchema, surveySchema, surveysSchema, surveyAnswerSchema, errorSchema, surveyResultSchema, surveyResultParamsSchema } from './schemas/'

export default {
  account: accountSchema,
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  surveyParams: surveyParamsSchema,
  surveyResultParams: surveyResultParamsSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  surveyAnswer: surveyAnswerSchema,
  surveyResult: surveyResultSchema,
  error: errorSchema
}
