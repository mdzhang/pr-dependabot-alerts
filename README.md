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
    if: github.actor == 'dependabot[bot]'
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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute.
