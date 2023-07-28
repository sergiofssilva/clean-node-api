import type { AccountModel } from '@/domain/models/account'
import type { AuthenticationModel } from '@/domain/models/authentication'
import type { AddAccountParams } from '@/domain/usecases/account/add-account'
import type { AuthenticationParams } from '@/domain/usecases/account/authentication'

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
