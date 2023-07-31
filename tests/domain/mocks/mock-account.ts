import type { AccountModel } from '@/domain/models'
import type { AddAccount, Authentication } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockOtherAddAccountParams = (): AddAccount.Params => ({
  name: 'other_name',
  email: 'other_email@mail.com',
  password: 'other_password'
})

export const mockAccountModel = (): AccountModel => ({
  ...mockAddAccountParams(),
  id: 'any_id'
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: 'any_token',
  name: 'any_name'
})
