import { EmailValidation, RequiredFieldValidation, CompareFieldsValidation, ValidationComposite } from '../../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'
import type { Validation } from '../../../../../presentation/protocols'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation [] = []
  const emailValidatorAdapter = new EmailValidatorAdapter()
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
