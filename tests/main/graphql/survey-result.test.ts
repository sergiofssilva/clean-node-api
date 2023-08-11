import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'
import { setupApolloServer } from '@/main/graphql/apollo'
import type { Collection } from 'mongodb'
import { gql } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'

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
    const surveyResultQuery = gql`
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
    `
    test('Should return an AccessDenied Error if no token is provided', async () => {
      const surveyId = 'any_id'
      const result = await setupApolloServer().executeOperation({
        query: surveyResultQuery,
        variables: { surveyId }
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('Access Denied')
      expect(result.data).toBeFalsy()
    })

    test('Should return a SurveyResult with valid credentials', async () => {
      const accessToken = await makeAccessToken()
      const surveyInsertResult = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = surveyInsertResult.insertedId.toHexString()
      const result = await setupApolloServer().executeOperation({
        query: surveyResultQuery,
        variables: { surveyId }
      }, { req: { headers: { 'x-access-token': accessToken } } } as any)
      expect(result.errors).toBeFalsy()
      expect(result.data.surveyResult.surveyId).toBe(surveyId)
      expect(result.data.surveyResult.question).toBe('any_question')
      expect(result.data.surveyResult.answers).toEqual([{
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
    const surveyResultMutation = gql`
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
    `
    test('Should return an AccessDenied Error if no token is provided', async () => {
      const surveyId = 'any_id'
      const answer = 'any_answer'
      const result = await setupApolloServer().executeOperation({
        query: surveyResultMutation,
        variables: { surveyId, answer }
      })
      expect(result.errors).toBeTruthy()
      expect(result.errors[0].message).toBe('Access Denied')
      expect(result.data).toBeFalsy()
    })

    test('Should return a SurveyResult if accessToken is provided', async () => {
      const answer = 'any_answer'
      const accessToken = await makeAccessToken()
      const surveyInsertResult = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = surveyInsertResult.insertedId.toHexString()
      const result = await setupApolloServer().executeOperation({
        query: surveyResultMutation,
        variables: { surveyId, answer }
      }, { req: { headers: { 'x-access-token': accessToken } } } as any)
      expect(result.errors).toBeFalsy()
      expect(result.data.saveSurveyResult.question).toBe('any_question')
      expect(result.data.saveSurveyResult.answers).toEqual([{
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
