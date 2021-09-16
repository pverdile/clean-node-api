import { EmailValidator } from '../presentation/protocols/emailValidator'
import validator from 'validator'

export function emailValidatorAdapter (): EmailValidator {
  return {
    isValid (email: string) {
      return validator.isEmail(email)
    }
  }
}
