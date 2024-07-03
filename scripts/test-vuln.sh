#!/usr/bin/env bash
set -e

npx @cyclonedx/cyclonedx-npm \
  --ignore-npm-errors \
  --output-file .test-vuln.sbom.gitignored.json \
  && \
  trivy sbom  \
    --format table \
    --exit-code 0 \
    --ignore-unfixed \
    --scanners vuln \
    --severity HIGH,CRITICAL \
    .test-vuln.sbom.gitignored.json