import { ok } from '../../../helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.loadSurveys.load()
    return ok(response)
  }
}
