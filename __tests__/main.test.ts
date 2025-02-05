/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

jest.unstable_mockModule('@actions/core', () => core)

const { run } = await import('../src/main.js')

describe('main.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets the vulnerabilitySeverityLevel output', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'dependabotAlertUrl',
      'https://github.com/org/repo/security/dependabot/1'
    )

    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'vulnerabilitySeverityLevel',
      'critical'
    )
  })
})
