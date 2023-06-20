import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import type { AddAccountModel } from '@/domain/usecases/add-account'
import request from 'supertest'
import app from '@/main/config/app'
import env from '@/main/config/env'
import type { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

const makeFakeSurveyData = (): any => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const response = await accountCollection.insertOne({
    ...makeFakeAddAccountModel(),
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
        .send(makeFakeSurveyData())
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyData())
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
      await surveyCollection.insertOne(makeFakeSurveyData())
      await request(app)
        .get('/api/survey')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
