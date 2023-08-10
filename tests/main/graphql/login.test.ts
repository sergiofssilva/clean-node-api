import { mockAddAccountParams } from '@/tests/domain/mocks'
import env from '@/main/config/env'
import { setupApolloServer } from '@/main/graphql/apollo'
import { MongoHelper } from '@/infra/db'
import type { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    test('Should return an account on valid credentials', async () => {
      const { email, name } = mockAddAccountParams()
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        password
      })
      const result = await setupApolloServer().executeOperation({
        query: 'query login($email: String!, $password: String!) { login (email: $email, password: $password) { accessToken, name } }',
        variables: { email, password: '123' }
      })
      expect(result.errors).toBeUndefined()
      expect(result.data.login.accessToken).toBeTruthy()
      expect(result.data.login.name).toBe(name)
    })

    test('Should return an error on invalid credentials', async () => {
      const { email } = mockAddAccountParams()
      const result = await setupApolloServer().executeOperation({
        query: 'query login($email: String!, $password: String!) { login (email: $email, password: $password) { accessToken, name } }',
        variables: { email, password: '123' }
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('Unauthorized Error')
      expect(result.data).toBeFalsy()
    })
  })
})
