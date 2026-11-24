# Security Policy

## Supported version

Security fixes are made against the default branch.

## Reporting a vulnerability

Please do not publish exploit details, customer data, credentials, or proof-of-concept requests in a public issue. Contact the repository owner privately through GitHub's private vulnerability reporting feature, if enabled, or another private channel already provided by Lado Organics.

Include the affected URL or file, impact, reproduction steps using test data, and any suggested mitigation. Do not include live secrets or personal customer information.

## Credential handling

Never commit .env.local, production credentials, database URLs, access tokens, SMTP passwords, or payment-provider secrets. If a secret may have been exposed, revoke and rotate it immediately, then update the deployment environment.
