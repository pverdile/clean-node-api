import { AddAccount } from '../../domain/usecases/addAccount'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/httpHelpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export function SignUpController (emailValidator: EmailValidator, addAccount: AddAccount): Controller {
  return {
    handle (httpRequest: HttpRequest): HttpResponse {
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

        return {
          statusCode: 200,
          body: addAccount.add({
            name, email, password
          })
        }
      } catch (error) {
        return serverError()
      }
    }
  }
}
