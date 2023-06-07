export interface UpdateAccessTokeRepository {
  updateAccessToken (id: string, token: string): Promise<void>
}
