import { EmailValidation } from './../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from './../../../presentation/helpers/validators/required-field-validation'
import { EmailValidatorAdapter } from './../../../utils/email-validator-adapter'
import { ValidationComposite } from './../../../presentation/helpers/validators/validation-composite'
import type { Validation } from '../../../presentation/protocols/validation'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation [] = []
  const emailValidatorAdapter = new EmailValidatorAdapter()
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
