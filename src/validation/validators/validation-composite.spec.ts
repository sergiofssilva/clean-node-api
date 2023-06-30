import { ValidationComposite } from './validation-composite'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import type { Validation } from '@/presentation/protocols'
import { mockValidation } from '@/validation/test'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    mockValidation(),
    mockValidation()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the firstError if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const [firstValidation, secondValidation] = validationStubs
    jest.spyOn(firstValidation, 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    jest.spyOn(secondValidation, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should not returns if all validations succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
