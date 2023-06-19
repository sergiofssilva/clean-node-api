import type { AddSurveyModel } from './../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from './survey-mongo-repository'
import type { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

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

  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
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
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})
