import { loginPath, surveyPath, signUpPath } from './paths'
import { badRequestComponent, serverErrorComponent, unauthorizedComponent, forbiddenComponent } from './components'
import { accountSchema, signUpParamsSchema, loginParamsSchema, surveySchema, surveysSchema, surveyAnswerSchema, errorSchema, apiKeyAuthSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'This project is about an API to manage surveys.',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Survey'
  }],
  paths: {
    '/signup': signUpPath,
    '/login': loginPath,
    '/survey': surveyPath
  },
  schemas: {
    account: accountSchema,
    signUpParams: signUpParamsSchema,
    loginParams: loginParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    unauthorized: unauthorizedComponent,
    forbidden: forbiddenComponent
  }
}
