import type { AccountModel, AuthenticationModel } from '@/domain/models'
import type { AddAccountParams, AuthenticationParams } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockOtherAddAccountParams = (): AddAccountParams => ({
  name: 'other_name',
  email: 'other_email@mail.com',
  password: 'other_password'
})

export const mockAccountModel = (): AccountModel => ({
  ...mockAddAccountParams(),
  id: 'any_id'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: 'any_token',
  name: 'any_name'
})
