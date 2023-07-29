import { MongoHelper } from '@/infra/db'
import request from 'supertest'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import type { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    ...mockAddAccountParams()
  })
  const accountId = response.insertedId.toString()
  const accessToken = sign(accountId, env.jwtSecret)
  await accountCollection.updateOne({ _id: response.insertedId }, { $set: { accessToken } })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('PUT /survey/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/survey/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const response = await surveyCollection.insertOne(mockAddSurveyParams())
      await request(app)
        .put(`/api/survey/${response.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })

  describe('GET /survey/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/survey/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const response = await surveyCollection.insertOne(mockAddSurveyParams())
      await request(app)
        .get(`/api/survey/${response.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
