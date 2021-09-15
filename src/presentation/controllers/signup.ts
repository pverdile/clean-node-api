import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (typeof httpRequest.body.name === 'undefined') {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (typeof httpRequest.body.email === 'undefined') {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    return {
      statusCode: 200,
      body: 'love'
    }
  }
}
