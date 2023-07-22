import type { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  load (accountId: string): Promise<SurveyModel[]>
}
