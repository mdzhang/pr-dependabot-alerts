import semver from 'semver'
import * as core from '@actions/core'

export function matchAlert(alerts: Array<any>, pr: Record<any, any>) {
  const ref = pr.head.ref

  // e.g. 'dependabot/npm_and_yarn/nanoid-3.3.8'
  const regex =
    /^dependabot\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+\.\d+\.\d+)$/

  const match = ref.match(regex)

  if (!match) {
    core.debug(`Ref ${ref} did not match expected regex`)
    return null
  }

  // const pkgmanager = match[1]
  const packageName = match[2]
  const version = match[3]
  core.debug(
    `Attempting to match using package ${packageName} and version ${version}`
  )

  return alerts.find((alert) => {
    const currentPackageName = alert.security_vulnerability.package.name
    const currentVersion =
      alert.security_vulnerability.first_patched_version.identifier

    core.debug(
      `Checking package ${currentPackageName} of version ${currentVersion}`
    )
    return (
      currentPackageName == packageName &&
      semver.satisfies(version, `>=${currentVersion}`)
    )
  })
}
