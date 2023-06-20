import type { AccountModel } from '@/domain/models/account'

export interface LoadAccountByToken {
  load (token: string, role?: string): Promise<AccountModel>
}
