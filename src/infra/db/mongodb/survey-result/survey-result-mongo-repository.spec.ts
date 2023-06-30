import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'
import { mockAddAccountParams, mockAddSurveyParams, mockSaveSurveyResultParams } from '@/domain/test'
import type { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

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
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const sut = makeSut()
      const surveyResult = await sut.save({
        ...mockSaveSurveyResultParams(),
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(mockSaveSurveyResultParams().answer)
    })

    test('Should update a survey result if its not new', async () => {
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const result = await surveyResultCollection.insertOne({
        ...mockSaveSurveyResultParams(),
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
