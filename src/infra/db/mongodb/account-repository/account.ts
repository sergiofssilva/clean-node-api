import type { LoadAccountByEmailRepository } from './../../../../data/protocols/db/load-account-by-email-repository'
import type { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import type { AccountModel } from '../../../../domain/models/account'
import type { AddAccountModel } from './../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.insertMap(accountData, result)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne<AccountModel>({ email })
    return MongoHelper.map(account)
  }
}
