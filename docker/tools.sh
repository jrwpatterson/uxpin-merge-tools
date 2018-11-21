#!/bin/bash
# shellcheck source=./helpers.sh
source .uxpinci/helpers.sh

cd /app/packages/uxpin-merge-cli
capture_status make test-resources
capture_status make build
capture_status make check
capture_status make test-ci
cd /app
capture_status ./packages/uxpin-merge-cli/node_modules/.bin/codecov -F unittests -F uxpin_merge_cli
