import type { LoadSurveysRepository } from './../../../../data/protocols/db/survey/load-surveys-repository'
import { MongoHelper } from './../helpers/mongo-helper'
import type { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import type { AddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-repository'
import type { SurveyModel } from '../../../../domain/models/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = surveyCollection.find<SurveyModel>({})
    return await surveys.toArray()
  }
}
