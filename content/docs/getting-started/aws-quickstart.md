---
title: AWS Quickstart
lede: Deploy a Next.js app to your own AWS account — Lambda + CloudFront + S3 + ACM. Same flow as every other target — `nextdeploy init`, set your env and secrets, `nextdeploy ship`.
status: draft
sourceRef: cli/cmd/init.go, cli/cmd/ship.go, cli/internal/serverless/aws*.go
related:
  - title: AWS Lambda
    href: /docs/aws/lambda
  - title: CloudFront
    href: /docs/aws/cloudfront
  - title: DNS Configuration
    href: /docs/dns
---

## The flow

NextDeploy has one universal flow, regardless of where you deploy:

1. `nextdeploy init` — pick your deployment platform.
2. Set the env and secrets that platform needs.
3. `nextdeploy ship` — build and deploy.

For AWS, that's: pick **Serverless (AWS CloudFront & Lambda)** at the prompt, give it AWS credentials and your app's secrets, then ship.

## Prerequisites

An AWS account, an IAM user/role with permission to create Lambda + CloudFront + S3 + ACM resources, and a domain you control (you can use the CloudFront URL initially if not).

## 1. Initialize

Run `nextdeploy init` and choose **Serverless (AWS CloudFront & Lambda)**. NextDeploy writes a `nextdeploy.yml` with `target_type: serverless` and `provider: aws`. Edit it to set your region and domain.

## 2. Configure AWS credentials + app secrets

NextDeploy uses the standard AWS credential chain (env vars, `~/.aws/credentials`, IAM role). Make sure those are set however you normally would.

Then load any env your app needs at runtime:

```sh
nextdeploy secrets set DATABASE_URL=...
nextdeploy secrets set NEXTAUTH_SECRET=...
# or bulk-load from a .env file
nextdeploy secrets load .env.production
```

Secrets are encrypted locally and surfaced to Lambda at runtime via the secrets extension.

## 3. Ship

```sh
nextdeploy ship
```

`ship` builds with vanilla `next build`, packages the standalone output for Lambda, uploads static assets to S3, creates/updates the Lambda function, configures CloudFront (with an ACM cert if you've set a custom domain), and prints the resulting URL. First deploy provisions everything; subsequent deploys are incremental.

## 4. ACM cert validation (custom domain only)

If you set a custom domain, the first ship will print the CNAME records you need to add for ACM validation. Add them at your DNS provider, then re-run `ship` once the cert is issued.

## 5. Verify

The CloudFront URL works immediately. Once DNS propagates for your custom domain, that works too.

## Cost expectations

For a low-traffic personal site, expect well under $5/month — dominated by CloudFront egress and Lambda invocations. Storage (S3) and ACM are effectively free at small scale.
