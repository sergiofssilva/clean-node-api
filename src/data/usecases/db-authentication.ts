import type {
  LoadAccountByEmailRepository,
  UpdateAccessTokeRepository,
  HashComparer,
  Encrypter
} from '@/data/protocols'
import type { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokeRepository: UpdateAccessTokeRepository
  ) {}

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const { id, password, name } = account
      const match = await this.hashComparer.compare(authentication.password, password)
      if (match) {
        const accessToken = await this.encrypter.encrypt(id)
        await this.updateAccessTokeRepository.updateAccessToken(id, accessToken)
        return {
          accessToken,
          name
        }
      }
    }
    return null
  }
}
