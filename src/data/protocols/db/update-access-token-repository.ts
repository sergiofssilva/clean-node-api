export interface UpdateAccessTokeRepository {
  updateAccessToken (id: string, tokenAccess: string): Promise<void>
}
