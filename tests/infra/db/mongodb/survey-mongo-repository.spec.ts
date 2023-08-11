import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import env from '@/main/config/env'
import type { Collection } from 'mongodb'
import FakeObjectId from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const anyId = new FakeObjectId().toHexString()

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountResponse = await accountCollection.insertOne(mockAddAccountParams())
      const surveysResponse = await surveyCollection.insertMany([
        mockAddSurveyParams(),
        {
          ...mockAddSurveyParams(),
          question: 'other_question'
        }
      ])
      await surveyResultCollection.insertOne({
        surveyId: surveysResponse.insertedIds[0],
        accountId: accountResponse.insertedId,
        answer: 'any_answer',
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountResponse.insertedId.toHexString())
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list surveys if no records is found', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll(anyId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById', () => {
    test('Should load a survey by an id', async () => {
      const result = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(result.insertedId.toHexString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey doesnt exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(anyId)
      expect(survey).toBeFalsy()
    })
  })

  describe('checkById', () => {
    test('Should return true if survey exists', async () => {
      const result = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(result.insertedId.toHexString())
      expect(exists).toBe(true)
    })

    test('Should return false if survey doesnt exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(anyId)
      expect(exists).toBe(false)
    })
  })
})
