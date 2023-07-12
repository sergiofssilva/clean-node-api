export const serverErrorComponent = {
  description: 'Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
