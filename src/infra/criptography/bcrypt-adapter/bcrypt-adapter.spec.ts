import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hashed_value') })
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashedSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashedSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hashed_value')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        await new Promise((resolve, reject) => { reject(new Error()) })
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const compareResult = await sut.compare('any_value', 'any_hash')
      expect(compareResult).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<ReturnType<(key: boolean) => Promise<boolean>>>
      compareSpy.mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
      const compareResult = await sut.compare('any_value', 'any_hash')
      expect(compareResult).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
        await new Promise((resolve, reject) => { reject(new Error()) })
      })
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
