import { mockAddAccountParams } from '@/tests/domain/mocks'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import type { Collection } from 'mongodb'
import type { Express } from 'express'
import request from 'supertest'
import { hash } from 'bcrypt'

let app: Express
let accountCollection: Collection

describe('Login GraphQL', () => {
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

  describe('Login Query', () => {
    const { name, email } = mockAddAccountParams()
    const queryData = {
      query: `query login($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          name
        }
      }`,
      variables: { email, password: '123' }
    }

    test('Should return an error on invalid credentials', async () => {
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeTruthy()
      expect(result.body.errors[0].message).toBe('Unauthorized Error')
      expect(result.body.data).toBeFalsy()
    })

    test('Should return an account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        password
      })
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeUndefined()
      expect(result.body.data.login.accessToken).toBeTruthy()
      expect(result.body.data.login.name).toBe(name)
    })
  })

  describe('SignUp Mutation', () => {
    const { password, name } = mockAddAccountParams()
    const queryData = {
      query: `mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        } 
      }`,
      variables: { ...mockAddAccountParams(), passwordConfirmation: password }
    }

    test('Should add an account on success', async () => {
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeUndefined()
      expect(result.body.data.signUp.accessToken).toBeTruthy()
      expect(result.body.data.signUp.name).toBe(name)
    })

    test('Should return an error on if the received email is already in use', async () => {
      await accountCollection.insertOne(mockAddAccountParams())
      const result = await request(app)
        .post('/graphql')
        .send(queryData)
      expect(result.body.errors).toBeTruthy()
      expect(result.body.errors[0].message).toBe('The received email is already in use')
      expect(result.body.data).toBeFalsy()
    })
  })
})
