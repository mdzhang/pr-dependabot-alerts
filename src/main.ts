import * as core from '@actions/core'
import * as github from '@actions/github'
import { RequestError } from '@octokit/request-error'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true })
    const octokit = github.getOctokit(token)
    const context = github.context

    const orgName = context.repo.owner
    const repoName = context.repo.repo

    if (!context.payload.pull_request) {
      core.setFailed('This action must be run on a pull request.')
      return
    }

    const pr = context.payload.pull_request
    core.debug(`Processing PR #${pr.number}: ${pr.title}`)

    if (
      !pr.user?.login.includes('dependabot') &&
      !pr.title.toLowerCase().includes('security')
    ) {
      core.setOutput('dependabotAlertUrl', null)
      core.setOutput('vulnerabilitySeverityLevel', null)
      core.info('PR is not a Dependabot security update.')
      return
    }

    const alertsResponse = await octokit.request(
      'GET /repos/{owner}/{repo}/dependabot/alerts',
      {
        owner: orgName,
        repo: repoName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    const alerts = alertsResponse.data

    if (alerts.length === 0) {
      core.setOutput('dependabotAlertUrl', null)
      core.setOutput('vulnerabilitySeverityLevel', null)
      core.info(
        'PR cannot be a Dependabot security update; no security alerts exist for repo.'
      )
      return
    }

    const severities = {
      critical: 1,
      high: 2,
      medium: 3, // what shows in event payloads
      moderate: 3, // what shows in the UI
      low: 4
    }

    const highestSeverityAlert = alerts.sort((a, b) => {
      return (
        severities[a.security_vulnerability.severity] -
        severities[b.security_vulnerability.severity]
      )
    })[0]

    core.debug(`Alerts response\n${JSON.stringify(alerts)}`)

    let alertUrl: string | null = null
    let severity: string | null = null

    severity = highestSeverityAlert.security_vulnerability.severity
    alertUrl = highestSeverityAlert.html_url

    core.setOutput('dependabotAlertUrl', alertUrl || '')
    core.setOutput('vulnerabilitySeverityLevel', severity || '')

    if (alertUrl && severity) {
      core.info(
        `Found Dependabot alert: ${alertUrl} with severity: ${severity}`
      )
    } else {
      core.info('No Dependabot alert found in PR.')
    }
  } catch (error) {
    if (error instanceof RequestError) {
      core.info(`RequestError: ${JSON.stringify(error.response)}`)
    }
    if (error instanceof Error) core.setFailed(error.message)
  }
}
