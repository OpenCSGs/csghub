.PHONY: setup run build clean

# 默认目标
all: run

# 设置项目
setup: setup-go setup-frontend

# 设置Go环境
setup-go:
	@echo "Setting up Go environment..."
	go mod tidy
	go install github.com/cosmtrek/air@latest

# 设置前端环境
setup-frontend:
	@echo "Setting up frontend environment..."
	cd frontend && yarn install

# 运行项目
run:
	@echo "Starting the application..."
	@make -j2 run-frontend run-backend

# 运行前端
run-frontend:
	@echo "Starting frontend..."
	cd frontend && yarn dev_build

# 运行后端
run-backend:
	@echo "Starting backend..."
	air

# 构建项目
build:
	@echo "Building the project..."
	cd frontend && yarn build
	go build -o app

# 清理项目
clean:
	@echo "Cleaning up..."
	rm -f app

# 帮助信息
help:
	@echo "Available commands:"
	@echo "  make setup      - Set up the project (Go and frontend)"
	@echo "  make setup_go   - Set up the project (Go)"
	@echo "  make setup_frontend      - Set up the project (frontend)"
	@echo "  make run        - Run the application (frontend and backend)"
	@echo "  make build      - Build the project"
	@echo "  make clean      - Clean up build artifacts and dependencies"
	@echo "  make all        - Set up and run the application (default)"
	@echo "  make help       - Show this help message"
