export const unauthorizedComponent = {
  description: 'Invalid Credentials',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
