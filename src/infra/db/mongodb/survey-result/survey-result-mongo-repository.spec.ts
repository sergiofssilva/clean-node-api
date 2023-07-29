import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'
import { mockAddAccountParams, mockOtherAddAccountParams, mockAddSurveyParams, mockSaveSurveyResultParams } from '@/tests/domain/mocks'
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
      const { answers } = mockAddSurveyParams()
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const sut = makeSut()
      await sut.save({
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString(),
        answer: answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: surveyResponse.insertedId,
        accountId: accountResponse.insertedId
      })
      expect(surveyResult._id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyResponse.insertedId)
      expect(surveyResult.accountId).toEqual(accountResponse.insertedId)
      expect(surveyResult.answer).toBe(answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const { answers } = mockAddSurveyParams()
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      await surveyResultCollection.insertOne({
        ...mockSaveSurveyResultParams(),
        surveyId: surveyResponse.insertedId,
        accountId: accountResponse.insertedId
      })
      const sut = makeSut()
      await sut.save({
        surveyId: surveyResponse.insertedId.toString(),
        accountId: accountResponse.insertedId.toString(),
        answer: answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: surveyResponse.insertedId,
        accountId: accountResponse.insertedId
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result [any_account]', async () => {
      const { answers } = mockAddSurveyParams()
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const otherAccountResponse = await accountCollection.insertOne(mockOtherAddAccountParams())
      const surveyId = surveyResponse.insertedId
      await surveyResultCollection.insertMany([{
        answer: answers[0].answer,
        date: new Date(),
        surveyId,
        accountId: accountResponse.insertedId
      }, {
        answer: answers[1].answer,
        date: new Date(),
        surveyId,
        accountId: otherAccountResponse.insertedId
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString(), accountResponse.insertedId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyResponse.insertedId)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result [other_account]', async () => {
      const { answers } = mockAddSurveyParams()
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const otherAccountResponse = await accountCollection.insertOne(mockOtherAddAccountParams())
      const surveyId = surveyResponse.insertedId
      await surveyResultCollection.insertMany([{
        answer: answers[0].answer,
        date: new Date(),
        surveyId,
        accountId: accountResponse.insertedId
      }, {
        answer: answers[1].answer,
        date: new Date(),
        surveyId,
        accountId: otherAccountResponse.insertedId
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString(), otherAccountResponse.insertedId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyResponse.insertedId)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result [none_account]', async () => {
      const { answers } = mockAddSurveyParams()
      const surveyResponse = await surveyCollection.insertOne(mockAddSurveyParams())
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const noneAccountResponse = await accountCollection.insertOne({
        ...mockAddAccountParams(),
        email: 'none_email@mail.com'
      })
      const surveyId = surveyResponse.insertedId
      await surveyResultCollection.insertMany([{
        answer: answers[0].answer,
        date: new Date(),
        surveyId,
        accountId: accountResponse.insertedId
      }, {
        answer: answers[1].answer,
        date: new Date(),
        surveyId,
        accountId: accountResponse.insertedId
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString(), noneAccountResponse.insertedId.toString())
      console.log(surveyResult)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyResponse.insertedId)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })
  })
})
