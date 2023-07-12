export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  }
}

export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    }
  }
}

export const surveysSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/survey'
  }
}
