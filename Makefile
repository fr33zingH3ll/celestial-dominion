# Lance Galactic Seekers : frontend Vite + backend (http://127.0.0.1:3000).
# Le backend utilise MariaDB sur 100.70.202.121.

.DEFAULT_GOAL := dev
SHELL := /usr/bin/env bash

.PHONY: help install dev front back

help:
	@echo "make          installe les dépendances si besoin, puis lance le front et le back"
	@echo "make install  installe les dépendances npm"
	@echo "make front    lance uniquement le frontend (Vite)"
	@echo "make back     lance uniquement le backend (http://127.0.0.1:3000)"

node_modules/.installed: package.json package-lock.json front-end/package.json back-end/package.json game-engine/package.json
	npm install
	@touch $@

install: node_modules/.installed

front: install
	npm run dev --workspace=front-end

back: install
	npm start --workspace=back-end

dev: install
	@echo "Backend  → http://127.0.0.1:3000"
	@echo "Frontend → URL affichée par Vite"
	@echo "MariaDB : 100.70.202.121. Ctrl+C arrête les deux."
	@back=0; front=0; \
	cleanup() { \
		kill $$back $$front 2>/dev/null || true; \
		wait $$back $$front 2>/dev/null || true; \
	}; \
	trap cleanup INT TERM EXIT; \
	npm start --workspace=back-end & back=$$!; \
	npm run dev --workspace=front-end & front=$$!; \
	wait $$back $$front
