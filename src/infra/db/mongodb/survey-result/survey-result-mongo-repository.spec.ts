import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'
import type { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import type { AddSurveyModel } from '@/domain/usecases/add-survey'
import type { AddAccountModel } from '@/domain/usecases/add-account'
import type { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_mail@mail.com',
  password: 'any_password'
})

describe('Survey Result MongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const surveyResponse = await surveyCollection.insertOne(makeFakeSurveyData())
      const accountResponse = await accountCollection.insertOne(makeFakeAccountData())
      const sut = makeSut()
      const surveyResult = await sut.save({
        ...makeFakeSurveyResultData(),
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(makeFakeSurveyResultData().answer)
    })
  })
})
