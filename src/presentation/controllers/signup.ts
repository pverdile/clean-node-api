export class SignUpController {
  handle (httpRequest: any): any {
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
  }
}
