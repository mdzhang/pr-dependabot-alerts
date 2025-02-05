import type * as core from '@actions/core'
import { jest } from '@jest/globals'

export const debug = jest.fn<typeof core.debug>((message) =>
  console.log(message)
)
export const error = jest.fn<typeof core.error>((message) =>
  console.error(message)
)
export const info = jest.fn<typeof core.info>((message) => console.log(message))
export const getInput = jest.fn<typeof core.getInput>()
export const setOutput = jest.fn<typeof core.setOutput>()
export const setFailed = jest.fn<typeof core.setFailed>((message) =>
  console.log(message)
)
export const warning = jest.fn<typeof core.warning>()
