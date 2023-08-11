import { mockAddAccountParams } from '@/tests/domain/mocks'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import type { Express } from 'express'
import type { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

let app: Express
let accountCollection: Collection

const makeSignUpAccount = (): any => ({
  name: 'Sergio',
  email: 'sergio.ecomp@gmail.com',
  password: '123',
  passwordConfirmation: '123'
})

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send(makeSignUpAccount())
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: mockAddAccountParams().email,
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on authentication fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'sergio.ecomp@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
