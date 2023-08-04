import type { CheckSurveyByIdRepository } from '@/data/protocols'
import type { CheckSurveyById } from '@/domain/usecases'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    return this.checkSurveyByIdRepository.checkById(id)
  }
}
