import { AddAccount } from '../../domain/usecases/add-account'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  function EncrypterStub (): Encrypter {
    return {
      encrypt: async (value: string): Promise<string> => {
        return await Promise.resolve('hashed_password')
      }
    }
  }

  return EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
