export interface AddSurveyModel {
  question: string
  answers: [{
    image: string
    answer?: string
  }]
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}
