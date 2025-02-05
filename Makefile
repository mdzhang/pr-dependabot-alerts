all:
	npm run bundle

test:
	npm run test

local:
	npx local-action . src/main.ts .env
