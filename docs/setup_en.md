## Installation and Startup Guide

### Installing Go

1. Visit the [Go official download page](https://golang.org/dl/).

2. Download the Go installer package suitable for your operating system.

3. Follow the [Go installation guide](https://golang.org/doc/install) to complete the installation.

4. After installation, open a terminal and run the following command to verify the installation:

   ```shell
   go version
   ```

   If the installation is successful, you will see the Go version information.

### Installing Node.js and Yarn

1. Visit the [Node.js official website](https://nodejs.org/).

2. Download and install the LTS (Long Term Support) version suitable for your operating system.

3. After installation, open a terminal and run the following commands to verify the installation:

   ```shell
   node --version
   npm --version
   ```

4. Install Yarn:

   ```shell
   npm install -g yarn
   ```

5. Verify Yarn installation:

   ```shell
   yarn --version
   ```

### Setting up Go Path

1. Determine your workspace: Choose a directory as your Go workspace, e.g., `~/go`.

2. Set `GOPATH`: Add the following to your shell configuration file (e.g., `.bashrc` or `.zshrc`):

   ```bash
   export GOPATH=$HOME/go
   export PATH=$PATH:$GOPATH/bin
   ```

3. Apply changes: Run one of the following commands to ensure the configuration file updates take effect:

   ```shell
   source ~/.bashrc
   # or
   source ~/.zshrc
   ```

4. Verify settings: Run the following command to verify that `GOPATH` is set correctly:

   ```shell
   go env GOPATH
   ```

   The output should be your workspace directory, e.g., `/home/username/go`.

### Setting Environment Variables (Recommended using direnv)

1. Install direnv: Follow the instructions in the [direnv official documentation](https://direnv.net/) to install.

2. Configure direnv: Add the following line to your shell configuration file (e.g., `.bashrc`, `.zshrc`, etc.):

   ```shell
   eval "$(direnv hook bash)"  # if using bash
   # or
   eval "$(direnv hook zsh)"   # if using zsh
   ```

   Reload your shell configuration file or restart your terminal.

3. Create .envrc file: In the project root directory, run:

   ```shell
   cp .envrc.example .envrc
   ```

4. Edit .envrc file: Edit the `.envrc` file according to your needs, setting necessary environment variables. For example:

   ```shell
   export CSGHUB_PORTAL_S3_ACCESS_KEY_ID=xxx
   export CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET=yyy
   # Add other required environment variables
   ```

5. Allow direnv to load .envrc file: In the project root directory, run:

   ```shell
   direnv allow .
   ```

### Getting Go Dependencies

To install necessary Go modules, run:

```shell
go mod tidy
```

### Installing Air for Live Reloading

Air is a tool that allows live reloading of Go applications. Install it using the following command:

```shell
go install github.com/cosmtrek/air@latest
```

### Getting Frontend Dependencies

Open the `frontend` directory and use Yarn to install dependencies:

```shell
cd frontend
yarn install
```

### Setting up the Database

1. Create database: Create a new database in your database management system. PostgreSQL is recommended, and you can use the following command:

   ```sql
   CREATE DATABASE your_database_name;
   ```

   Make sure to replace `your_database_name` with the actual database name you want to use.

2. Update .envrc file: Ensure your `.envrc` file contains the correct database connection information.

3. Initialize database: Run the following command to initialize the database:

   ```shell
   go run cmd/csghub-portal/main.go migration init
   ```

4. Execute database migrations: Run the following command to execute database migrations:

   ```shell
   go run cmd/csghub-portal/main.go migration migrate
   ```

## Startup

### Starting Both Frontend and Backend Services

To start both frontend and backend services simultaneously, run the following command:

```shell
make
```

### Starting Frontend Service Separately

If you only want to start the frontend service, run the following command:

```shell
make run-frontend
```

### Starting Go Service Separately

If you only want to start the Go service, run the following command:

```shell
make run-backend
```

### Starting via VS Code

1. Create .env file:
   - In the project root directory, locate the `.env.example` file.
   - Copy `.env.example` and rename the copy to `.env`.
   - Open the `.env` file and fill in all necessary environment variables according to your environment configuration.

   ```shell
   cp .env.example .env
   ```

2. Edit .env file:
   - Open the `.env` file with a text editor.
   - Fill in or modify each configuration item according to your development environment and requirements.
   - Ensure all necessary environment variables are correctly set.

3. In VS Code, open the "Run and Debug" view (usually the play button icon in the sidebar).

4. In the top dropdown menu, you can choose one of the following configurations:
   - "portal": Start the main server
   - "init": Initialize the database
   - "migrate": Execute database migration
   - "rollback": Rollback database migration

### Compiling the Project via Command Line

1. Compile the project:

   ```shell
   make build
   ```

2. Run the compiled executable:

   ```shell
   ./csghub-portal start server
   ```

### Accessing the Application

When both services are running, open your web browser and visit:

[http://localhost:8090](http://localhost:8090)

This will allow you to view and interact with the application.
