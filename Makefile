DOCKER_COMPOSE = docker compose

.PHONY: setup up down

setup:
	npm install
	npm run dev &
	$(DOCKER_COMPOSE) up -d
	sleep 3
	npx drizzle-kit migrate
	curl -X POST http://localhost:3000/api/seed

up:
	npm run dev &
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down