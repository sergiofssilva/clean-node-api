import { mockAddAccountParams } from '@/tests/domain/mocks'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'
import { setupApolloServer } from '@/main/graphql/apollo'
import type { Collection } from 'mongodb'
import { gql } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'

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
    const surveysQuery = gql`
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
    test('Should return an Access Denied Error without credentials', async () => {
      const result = await setupApolloServer().executeOperation({
        query: surveysQuery
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('Access Denied')
      expect(result.data).toBeFalsy()
    })

    test('Should return surveys with valid credentials', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(mockAddSurveyParamsWithoutDate())
      const result = await setupApolloServer().executeOperation({
        query: surveysQuery
      }, { req: { headers: { 'x-access-token': accessToken } } } as any)
      expect(result.errors).toBeFalsy()
      expect(result.data.surveys.length).toBe(1)
      expect(result.data.surveys[0].id).toBeTruthy()
      expect(result.data.surveys[0].question).toBe('any_question')
      expect(result.data.surveys[0].answers).toEqual([{
        image: 'any_image',
        answer: 'any_answer'
      }])
    })
  })
})
