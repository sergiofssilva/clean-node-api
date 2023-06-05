export interface UpdateAccessTokeRepository {
  update (id: string, tokenAccess: string): Promise<void>
}
