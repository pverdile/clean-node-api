import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelpers'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (typeof httpRequest.body.name === 'undefined') {
      return badRequest(new MissingParamError('name'))
    }

    if (typeof httpRequest.body.email === 'undefined') {
      return badRequest(new MissingParamError('email'))
    }

    return {
      statusCode: 200,
      body: 'love'
    }
  }
}
