export class ForbiddenError extends Error {
  constructor () {
    super('Forbidden Error')
    this.name = 'ForbiddenError'
  }
}
