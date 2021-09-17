import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    function EncrypterStub (): Encrypter {
      return {
        encrypt: async (value: string): Promise<string> => {
          return await Promise.resolve('hashed_password')
        }
      }
    }

    const encrypterStub = EncrypterStub()
    const sut = DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
