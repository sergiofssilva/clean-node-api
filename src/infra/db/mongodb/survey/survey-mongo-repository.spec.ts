import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import type { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import env from '@/main/config/env'
import type { Collection } from 'mongodb'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([
        makeFakeSurveyData(),
        {
          ...makeFakeSurveyData(),
          question: 'other_question'
        }
      ])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty list surveys if no records is found', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById', () => {
    test('Should load a survey by an id', async () => {
      const result = await surveyCollection.insertOne(makeFakeSurveyData())
      const sut = makeSut()
      const survey = await sut.loadById(result.insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
