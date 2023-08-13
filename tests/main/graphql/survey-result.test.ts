import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
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

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    ...mockAddAccountParams(),
    role: 'admin'
  })
  const accessToken = sign(response.insertedId.toHexString(), env.jwtSecret)
  await accountCollection.updateOne({ _id: response.insertedId }, { $set: { accessToken } })
  return accessToken
}

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    const genericSurveyId = 'any_id'
    const queryData = {
      query: `
        query surveyResults ($surveyId: String!) {
          surveyResult (surveyId: $surveyId) {
            surveyId
            question
            date
            answers {
              image
              answer
              count
              percent
              isCurrentAccountAnswer
            }
          } 
        }
      `,
      variables: { surveyId: genericSurveyId }
    }

    test('Should return an AccessDenied Error if no token is provided', async () => {
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeTruthy()
      expect(result.body.errors[0].message).toBe('Access Denied')
      expect(result.body.data).toBeFalsy()
    })

    test('Should return a SurveyResult with valid credentials', async () => {
      const accessToken = await makeAccessToken()
      const surveyInsertResult = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = surveyInsertResult.insertedId.toHexString()
      queryData.variables = { surveyId }
      const result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send(queryData)
      expect(result.body.errors).toBeFalsy()
      expect(result.body.data.surveyResult.surveyId).toBe(surveyId)
      expect(result.body.data.surveyResult.question).toBe('any_question')
      expect(result.body.data.surveyResult.answers).toEqual([{
        answer: 'any_answer',
        image: 'any_image',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'other_answer',
        image: null,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })
  })

  describe('SurveyResult Mutation', () => {
    const genericSurveyId = 'any_id'
    const genericAnswer = 'any_answer'
    const queryData = {
      query: `
        mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
          saveSurveyResult (surveyId: $surveyId, answer: $answer) {
            question
            date
            answers {
              image
              answer
              count
              percent
              isCurrentAccountAnswer
            }
          } 
        }
      `,
      variables: { surveyId: genericSurveyId, answer: genericAnswer }
    }

    test('Should return an AccessDenied Error if no token is provided', async () => {
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeTruthy()
      expect(result.body.errors[0].message).toBe('Access Denied')
      expect(result.body.data).toBeFalsy()
    })

    test('Should return a SurveyResult if accessToken is provided', async () => {
      const answer = 'any_answer'
      const accessToken = await makeAccessToken()
      const surveyInsertResult = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = surveyInsertResult.insertedId.toHexString()
      queryData.variables = { surveyId, answer }
      const result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send(queryData)
      expect(result.body.errors).toBeFalsy()
      expect(result.body.data.saveSurveyResult.question).toBe('any_question')
      expect(result.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'any_answer',
        image: 'any_image',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'other_answer',
        image: null,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })
  })
})
