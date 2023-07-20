import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyResult, LoadSurveyById } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const { surveyId } = params
      await this.loadSurveyById.loadById(surveyId)
      const result = await this.loadSurveyResult.load(surveyId)
      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
