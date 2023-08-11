import { MongoHelper, LogMongoRepository } from '@/infra/db'
import env from '@/main/config/env'
import type { Collection } from 'mongodb'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Logo Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
