# pr-dependabot-alerts

[![GitHub Super-Linter](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/check-dist.yml/badge.svg)](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/mdzhang/pr-dependabot-alerts/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Usage

```yaml
name: security-alerts

on:
  pull_request:
    types:
      - opened

jobs:
  permissions:
    contents: read
    security-events: read

  notify-slack:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]' && github.event_name == 'pull_request'
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: PR Dependabot alerts
        id: pr-dependabot-alerts
        uses: mdzhang/pr-dependabot-alerts
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Send Slack Notification
        if:
          steps.pr-dependabot-alerts.outputs.vulnerabilitySeverityLevel ==
          'critical'
        uses: rtCamp/action-slack-notify@v2.3.2
        env:
          SLACK_CHANNEL: devnull
          SLACK_COLOR: 'orange'
          SLACK_MESSAGE: |
            🚨 *Dependabot Alert* 🚨
            A new PR for a *critical severity* vulnerability fix was created:
            *Repository:* ${{ github.repository }}
            *PR:* <${{ github.event.pull_request.html_url }}|${{ github.event.pull_request.title }}>
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_USERNAME: Dr. Security Hygiene
          SLACK_ICON_EMOJI: ':robot_face:'
          SLACK_FOOTER: ''
          MSG_MINIMAL: 'actions url,commit'
```

## Permissions

In order to add labels to pull requests, this action requires read permissions
for security events and Dependabot alerts. Refer to the
[GitHub token permissions documentation](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
for more details about access levels and event contexts.

This value needs to be set for
[Actions](https://github.com/mdzhang/pr-dependabot-alerts/settings/secrets/actions)
to work on PRs and for
[Dependabot](https://github.com/mdzhang/pr-dependabot-alerts/settings/secrets/dependabot)
to run when a new PR is created.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute.
