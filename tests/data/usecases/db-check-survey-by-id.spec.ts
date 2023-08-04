import { DbCheckSurveyById } from '@/data/usecases'
import type { CheckSurveyByIdRepository } from '@/data/protocols'
import { mockCheckSurveyByIdRepository } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckSurveyByIdRepository with correct values', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById('any_id')
    expect(exists).toBe(true)
  })

  test('Should throw if CheckSurveyByIdRepository throw', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
