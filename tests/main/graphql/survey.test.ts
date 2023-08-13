import { mockAddAccountParams } from '@/tests/domain/mocks'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import type { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import type { Express } from 'express'
import request from 'supertest'

let app: Express
let accountCollection: Collection
let surveyCollection: Collection

const mockAddSurveyParamsWithoutDate = (): any => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    ...mockAddAccountParams(),
    role: 'admin'
  })
  const accessToken = sign(response.insertedId.toHexString(), env.jwtSecret)
  await accountCollection.updateOne({ _id: response.insertedId }, { $set: { accessToken } })
  return accessToken
}

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const queryData = {
      query: `
        query surveys {
          surveys {
            id
            question
            date
            didAnswer
            answers {
              image
              answer
            }
          } 
        }
      `
    }

    test('Should return an Access Denied Error without credentials', async () => {
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeTruthy()
      expect(result.body.errors[0].message).toBe('Access Denied')
      expect(result.body.data).toBeFalsy()
    })

    test('Should return surveys with valid credentials', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(mockAddSurveyParamsWithoutDate())
      const result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send(queryData)
      expect(result.body.errors).toBeFalsy()
      expect(result.body.data.surveys.length).toBe(1)
      expect(result.body.data.surveys[0].id).toBeTruthy()
      expect(result.body.data.surveys[0].question).toBe('any_question')
      expect(result.body.data.surveys[0].answers).toEqual([{
        image: 'any_image',
        answer: 'any_answer'
      }])
    })
  })
})
