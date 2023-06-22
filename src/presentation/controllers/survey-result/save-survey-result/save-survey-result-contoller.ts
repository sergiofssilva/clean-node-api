import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-contoller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest
    await this.loadSurveyById.loadById(params?.surveyId)
    return await new Promise(resolve => { resolve(null) })
  }
}
