import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators'
import type { Validation } from '@/presentation/protocols'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation [] = []
  const emailValidatorAdapter = new EmailValidatorAdapter()
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
