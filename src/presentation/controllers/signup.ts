import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/httpHelpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export function SignUpController (emailValidator: EmailValidator): Controller {
  return {
    handle (httpRequest: HttpRequest): HttpResponse {
      try {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
          if (typeof httpRequest.body[field] === 'undefined') {
            return badRequest(new MissingParamError(field))
          }
        }

        const isValid = emailValidator.isValid(httpRequest.body.email)

        if (!isValid) {
          return badRequest(new InvalidParamError('email'))
        }

        return {
          statusCode: 200,
          body: 'love'
        }
      } catch (error) {
        return serverError()
      }
    }
  }
}
