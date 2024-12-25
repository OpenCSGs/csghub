.PHONY: setup run build clean

# default
all: run

# setup project
setup: setup-go setup-frontend

# setup go environment
setup-go:
	@echo "Setting up Go environment..."
	go mod tidy
	go install github.com/cosmtrek/air@latest

# setup frontend environment
setup-frontend:
	@echo "Setting up frontend environment..."
	cd frontend && yarn install

# run project
run:
	@echo "Starting the application..."
	@make -j2 run-frontend run-backend

# run frontend
run-frontend:
	@echo "Starting frontend..."
	cd frontend && yarn dev_build

# test frontend
test-frontend:
	@echo "Testing frontend..."
	cd frontend && yarn test

# run backend
run-backend:
	@echo "Starting backend..."
	air

# build project
build:
	@echo "Building the project..."
	cd frontend && yarn build
	go build -o csghub-portal ./cmd/csghub-portal

# clean project
clean:
	@echo "Cleaning up..."
	rm -f csghub-portal

# help message
help:
	@echo "Available commands:"
	@echo "  make setup      - Set up the project (Go and frontend)"
	@echo "  make setup_go   - Set up the project (Go)"
	@echo "  make setup_frontend      - Set up the project (frontend)"
	@echo "  make test_frontend      - Test the frontend"
	@echo "  make run        - Run the application (frontend and backend)"
	@echo "  make build      - Build the project"
	@echo "  make clean      - Clean up build artifacts and dependencies"
	@echo "  make all        - Set up and run the application (default)"
	@echo "  make help       - Show this help message"
