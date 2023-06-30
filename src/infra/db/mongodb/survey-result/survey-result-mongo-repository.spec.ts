import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import type { AddAccountParams } from '@/domain/usecases/account/add-account'
import type { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeAccountData = (): AddAccountParams => ({
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

    test('Should update a survey result if its not new', async () => {
      const surveyResponse = await surveyCollection.insertOne(makeFakeSurveyData())
      const accountResponse = await accountCollection.insertOne(makeFakeAccountData())
      const result = await surveyResultCollection.insertOne({
        ...makeFakeSurveyResultData(),
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString(),
        answer: 'other_answer',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(result.insertedId)
      expect(surveyResult.answer).toBe('other_answer')
    })
  })
})
