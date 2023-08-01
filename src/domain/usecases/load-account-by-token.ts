import type { AccountModel } from '@/domain/models/account'

export interface LoadAccountByToken {
  load (token: string, role?: string): Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
  export type Result = AccountModel
}
