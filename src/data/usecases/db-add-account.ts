import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Encrypter } from '../protocols/encrypter'

export function DbAddAccount (encrypter: Encrypter): AddAccount {
  return {
    add: async (account: AddAccountModel): Promise<AccountModel> => {
      await encrypter.encrypt(account.password)

      return await Promise.resolve({
        id: 'string',
        name: 'string',
        email: 'string',
        password: 'string'
      })
    }
  }
}
