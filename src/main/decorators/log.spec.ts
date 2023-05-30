import type { HttpRequest, HttpResponse, Controller } from './../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator ', () => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Sergio'
        }
      }
      return await new Promise(resolve => { resolve(httpResponse) })
    }
  }
  const controllerStub = new ControllerStub()

  test('Should call controller handle', async () => {
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })
})
