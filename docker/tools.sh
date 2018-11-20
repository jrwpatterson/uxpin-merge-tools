#!/bin/bash
# shellcheck source=./helpers.sh
source .uxpinci/helpers.sh

capture_status make check
capture_status make test-ci
cd ~/project/
capture_status ./packages/uxpin-merge-cli/node_modules/.bin/codecov -F unittests -F uxpin_merge_cli
