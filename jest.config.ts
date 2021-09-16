/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { defaults as tsjPreset } from 'ts-jest/presets'

export default {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  transform: {
    ...tsjPreset.transform
  }
}
