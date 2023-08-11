import { mockAddAccountParams } from '@/tests/domain/mocks'
import env from '@/main/config/env'
import { setupApolloServer } from '@/main/graphql/apollo'
import { MongoHelper } from '@/infra/db'
import type { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { gql } from 'apollo-server-express'

let accountCollection: Collection

describe('Login GraphQL', () => {
  beforeAll(async () => {
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
    const loginQuery = gql`
      query login($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          name
        } 
      }
    `
    test('Should return an account on valid credentials', async () => {
      const { email, name } = mockAddAccountParams()
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        password
      })
      const result = await setupApolloServer().executeOperation({
        query: loginQuery,
        variables: { email, password: '123' }
      })
      expect(result.errors).toBeUndefined()
      expect(result.data.login.accessToken).toBeTruthy()
      expect(result.data.login.name).toBe(name)
    })

    test('Should return an error on invalid credentials', async () => {
      const { email } = mockAddAccountParams()
      const result = await setupApolloServer().executeOperation({
        query: loginQuery,
        variables: { email, password: '123' }
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('Unauthorized Error')
      expect(result.data).toBeFalsy()
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        } 
      }
    `
    test('Should add an account on success', async () => {
      const { password, name } = mockAddAccountParams()
      const result = await setupApolloServer().executeOperation({
        query: signUpMutation,
        variables: { ...mockAddAccountParams(), passwordConfirmation: password }
      })
      expect(result.errors).toBeUndefined()
      expect(result.data.signUp.accessToken).toBeTruthy()
      expect(result.data.signUp.name).toBe(name)
    })

    test('Should return an error on if the received email is already in use', async () => {
      const { password } = mockAddAccountParams()
      await accountCollection.insertOne(mockAddAccountParams())
      const result = await setupApolloServer().executeOperation({
        query: signUpMutation,
        variables: { ...mockAddAccountParams(), passwordConfirmation: password }
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('The received email is already in use')
      expect(result.data).toBeFalsy()
    })
  })
})
