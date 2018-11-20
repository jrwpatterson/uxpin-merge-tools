#!/bin/bash

ARTIFACTS_PATH="${ARTIFACTS_PATH:-/artifacts}"
FINAL_EXIT_CODE=0

# Waint until host starts accepting connections
# Usage:
#   wait_for_tcp rabbitmq 5672
function wait_for_tcp {
  timeout 60 bash -c "until echo exit | nc '${1}' '${2}' >/dev/null &2>1; do sleep 0.2; done"
}

# Wait until Mysql server will be up and running
# Assumes current container is linked to mysql container via docker-compose link
function wait_for_mysql {
  MYSQL_CMD="mysql -h ${MYSQL_1_PORT_3306_TCP_ADDR} -u ${MYSQL_1_ENV_DB_USER}"

  # Wait until Mysql is ready
  timeout 60 bash -c "until ${MYSQL_CMD} -e 'select 1' >/dev/null &2>1; do sleep 0.2; done"
  # Mysql restarts during normal boot, so we have to double check for readiness
  sleep 10
}

# Run script against linked Mysql container
# Usage:
#   cat script.sql | mysql_exec
#   mysql_exec "select 1"
function mysql_exec {
  mysql -h "${MYSQL_1_PORT_3306_TCP_ADDR}" -u "${MYSQL_1_ENV_DB_USER}" "$@"
}

# Save file as artifact that will be available in build context (eg TeamCity)
function publish_artifact {
  # ensure artifact directory exists
  [ ! -d "${ARTIFACTS_PATH}" ] && mkdir -p "${ARTIFACTS_PATH}"

  filename=$(basename "${1}")
  destination_path="${ARTIFACTS_PATH}/${filename}"
  # ensure we don't overwrite artifact, if file exists add prefix to filename
  [ -f "${destination_path}" ] && destination_path="${ARTIFACTS_PATH}/${RANDOM}-${filename}"
  cp "${1}" "${destination_path}"
}

# Wrap command to capture it's error exit code
# If subcommand exits with status not equal to zero, it will be suppressed and execution will continue.
function capture_status {
  "$@" || FINAL_EXIT_CODE=1
}

# Teardown function will be executed when script completes
function teardown {
  exit ${FINAL_EXIT_CODE}
}
trap teardown EXIT INT

set -exo pipefail
