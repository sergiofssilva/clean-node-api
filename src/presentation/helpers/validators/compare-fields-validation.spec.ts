import { InvalidParamError } from './../../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('fieldName', 'fieldToCompareName')
    const error = sut.validate({ fieldName: 'any_value', fieldToCompareName: 'diferent_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompareName'))
  })
})
