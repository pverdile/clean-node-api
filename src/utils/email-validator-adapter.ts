import { EmailValidator } from '../presentation/protocols/email-validator'
import validator from 'validator'

export function emailValidatorAdapter (): EmailValidator {
  return {
    isValid (email: string) {
      return validator.isEmail(email)
    }
  }
}
