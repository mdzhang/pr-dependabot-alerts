import * as core from '@actions/core'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.debug('Hello world')

    core.setOutput(
      'dependabotAlertUrl',
      'https://github.com/org/repo/security/dependabot/1'
    )
    core.setOutput('vulnerabilitySeverityLevel', 'critical')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
