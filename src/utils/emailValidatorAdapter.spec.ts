import { emailValidatorAdapter } from './emailValidator'

describe('EmailValidator Adapter', () => {
  test('should return if validator returns false', () => {
    const sut = emailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
