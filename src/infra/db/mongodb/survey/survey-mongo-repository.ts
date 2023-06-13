import { MongoHelper } from './../helpers/mongo-helper'
import type { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import type { AddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-repository'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
