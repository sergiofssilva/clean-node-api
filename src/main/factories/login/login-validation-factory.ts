import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'
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
