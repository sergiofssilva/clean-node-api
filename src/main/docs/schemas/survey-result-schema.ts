export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string'
    }
  }
}

export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    couunt: {
      type: 'number'
    },
    percent: {
      type: 'number'
    },
    isCurrentAnswer: {
      type: 'boolean'
    }
  },
  required: ['answer', 'count', 'percent', 'isCurrentAnswer']
}
