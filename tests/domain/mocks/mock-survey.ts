import type { SurveyModel } from '@/domain/models'
import type { AddSurvey } from '@/domain/usecases'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveyModels = (): SurveyModel[] => ([
  {
    id: 'first_id',
    question: 'first_question',
    answers: [{
      answer: 'first_answer',
      image: 'any_image'
    }],
    date: new Date()
  },
  {
    id: 'second_id',
    question: 'second_question',
    answers: [{
      answer: 'first_answer'
    }],
    date: new Date()
  }
])
