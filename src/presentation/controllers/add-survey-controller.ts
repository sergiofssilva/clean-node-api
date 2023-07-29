import type { HttpRequest, HttpResponse, Controller, Validation } from '@/presentation/protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper'
import type { AddSurvey } from '@/domain/usecases'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }
      await this.addSurvey.add({
        ...body,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}