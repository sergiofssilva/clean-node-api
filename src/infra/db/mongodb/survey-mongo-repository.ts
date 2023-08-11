import { MongoHelper, QueryBuilder } from '@/infra/db'
import type { LoadSurveysRepository, AddSurveyRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository } from '@/data/protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()
    const surveys = await (surveyCollection.aggregate<LoadSurveysRepository.Result>(query)).toArray()
    return MongoHelper.mapArray(surveys)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne<CheckSurveyByIdRepository.Result>({
      _id: new ObjectId(id)
    }, {
      projection: {
        _id: 1
      }
    })
    return survey !== null
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne<LoadSurveyByIdRepository.Result>({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
