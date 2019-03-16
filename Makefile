.DEFAULT_GOAL := help
.PHONY: test tap unit jshint skel help
REPORTER = spec

all: test-unit-cover  ## TODO: Document

build:  ## runs the application
	npm run build

help:  ## Prints this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run:  ## runs the application
	npm run start

tap:  ## TODO: Document
	@NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

tests: test  ## Synonym for test

test: test-unit  ## Runs all tests available to the project

test-unit: ## Runs all the u nit tests available to the project
	npm run test-unit

test-unit-cover:  ## Runs the unit tests with code coverage enabled
	npm run test-unit-cover
