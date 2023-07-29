import { MongoHelper } from '@/infra/db'
import request from 'supertest'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import type { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

const mockAddSurveyParamsWithoutDate = (): any => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    ...mockAddAccountParams(),
    role: 'admin'
  })
  const accessToken = sign(response.insertedId.toString(), env.jwtSecret)
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

  describe('POST /survey', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send(mockAddSurveyParamsWithoutDate())
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParamsWithoutDate())
        .expect(204)
    })
  })

  describe('GET /survey', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/survey')
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(mockAddSurveyParamsWithoutDate())
      await request(app)
        .get('/api/survey')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
