export const forbiddenComponent = {
  description: 'Access Denied',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
