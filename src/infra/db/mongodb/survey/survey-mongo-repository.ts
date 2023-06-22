import { MongoHelper } from './../helpers/mongo-helper'
import type { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import type { SurveyModel } from '@/domain/models/survey'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import type { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = surveyCollection.find<SurveyModel>({})
    return MongoHelper.mapArray((await surveys.toArray()))
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne<SurveyModel>({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
