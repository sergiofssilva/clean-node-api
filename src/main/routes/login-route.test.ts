import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

const makeSignUpAccount = (): any => ({
  name: 'Sergio',
  email: 'sergio.ecomp@gmail.com',
  password: '123',
  passwordConfirmation: '123'
})

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
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
      await request(app)
        .post('/api/signup')
        .send(makeSignUpAccount())
        .then(async () => {
          await request(app)
            .post('/api/login')
            .send({
              email: 'sergio.ecomp@gmail.com',
              password: '123'
            })
            .expect(200)
        })
    })
  })
})
