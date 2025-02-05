/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import { jest } from '@jest/globals'
import * as github from '@actions/github'
import * as core from '../__fixtures__/core.js'
import alertsMock from '../__fixtures__/alerts.json'
import eventMock from '../__fixtures__/webhook_payload.json'

jest.unstable_mockModule('@actions/core', () => core)

const actualGithub = jest.requireActual<typeof github>('@actions/github')
const mockRequest = jest.fn()

jest.mock('@actions/github', () => ({
  ...actualGithub,
  getOctokit: jest.fn((token: string) => {
    const octokitInstance = actualGithub.getOctokit(token || 'unknown')
    return {
      ...octokitInstance,
      request: mockRequest
    }
  }),
  context: {
    repo: {
      owner: 'mdzhang',
      repo: 'pr-dependabot-alerts'
    },
    payload: eventMock.event
  }
}))

const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    mockRequest.mockReturnValue(alertsMock)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets the vulnerabilitySeverityLevel output', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'dependabotAlertUrl',
      'https://github.com/mdzhang/pr-dependabot-alerts/security/dependabot/1'
    )

    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'vulnerabilitySeverityLevel',
      'medium'
    )
  })
})
