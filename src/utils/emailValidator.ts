import { EmailValidator } from '../presentation/protocols/emailValidator'

export function emailValidatorAdapter (): EmailValidator {
  return {
    isValid (email: string) {
      return false
    }
  }
}
