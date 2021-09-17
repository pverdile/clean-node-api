import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export function SignUpController (emailValidator: EmailValidator, addAccount: AddAccount): Controller {
  return {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      try {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
          if (typeof httpRequest.body[field] === 'undefined') {
            return badRequest(new MissingParamError(field))
          }
        }

        const { name, email, password, passwordConfirmation } = httpRequest.body

        if (password !== passwordConfirmation) {
          return badRequest(new InvalidParamError('passwordConfirmation'))
        }

        const isValid = emailValidator.isValid(email)
        if (!isValid) {
          return badRequest(new InvalidParamError('email'))
        }

        const account = await addAccount.add({
          name, email, password
        })

        return ok(account)
      } catch (error) {
        console.error(error)
        return serverError()
      }
    }
  }
}
