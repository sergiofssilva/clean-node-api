import { badRequestComponent, serverErrorComponent, unauthorizedComponent, forbiddenComponent } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  serverError: serverErrorComponent,
  unauthorized: unauthorizedComponent,
  forbidden: forbiddenComponent
}
