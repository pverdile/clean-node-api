import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { HttpRequest, EmailValidator, AddAccount, AddAccountModel, AccountModel, Controller } from './signupProtocols'

const buildHttpRequest = (key?: 'name' | 'email' | 'password' | 'passwordConfirmation' | Record<string, string>): HttpRequest => {
  const defaultBody = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  if (typeof key === 'undefined') {
    return {
      body: defaultBody
    }
  }

  if (typeof key === 'string' && typeof defaultBody[key] === 'undefined') {
    return {
      body: defaultBody
    }
  }

  if (typeof key === 'object') {
    return {
      body: { ...defaultBody, ...key }
    }
  }

  const { [key]: value, ...updatedBody } = defaultBody

  return ({
    body: updatedBody
  })
}

const makeEmailValidator = (): EmailValidator => {
  function EmailValidatorStub (): EmailValidator {
    return {
      isValid (email: string): boolean {
        return true
      }
    }
  }

  return EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  function AddAccountStub (): AddAccount {
    return {
      add (account: AddAccountModel): AccountModel {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }

        return fakeAccount
      }
    }
  }

  return AddAccountStub()
}

interface SutTypes {
  sut: Controller
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = buildHttpRequest('name')
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = buildHttpRequest('email')
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = buildHttpRequest('password')
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = buildHttpRequest('passwordConfirmation')
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if no password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = buildHttpRequest({ passwordConfirmation: 'invalid_password' })
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = buildHttpRequest({ email: 'invalid_email@mail.com' })
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = buildHttpRequest({ email: 'any_email@mail.com' })
    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => { throw new Error() })
    const httpRequest = buildHttpRequest({ email: 'invalid_email@mail.com' })
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = buildHttpRequest()
    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(buildHttpRequest('passwordConfirmation').body)
  })
})
