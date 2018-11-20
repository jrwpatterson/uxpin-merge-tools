SHELL = /bin/bash
APP_IMAGE_VERSION = 2.22

ENVIRONMENTS =  tests
.PHONY: all $(ENVIRONMENTS)
all: $(ENVIRONMENTS)

tests:
	docker build \
		--build-arg VAULT_ADDR=$$VAULT_ADDR \
		--build-arg VAULT_TOKEN=$$VAULT_TOKEN \
		-t $$TEST_IMAGE \
		-f Dockerfile.$@ \
		..
