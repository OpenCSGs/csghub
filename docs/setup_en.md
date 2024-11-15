# Installation and Startup Guide

> [!WARNING]
`CSGHub` Portal has migrated the web framework from Rails to Gin. If you were previously using the Rails, please refer to the latest documentation to see how to [migrate to the Gin](https://github.com/OpenCSGs/csghub/blob/main/docs/migrate_to_gin_version_portal_en.md).

## Acknowledgements

This project is based on Rails, Vue3, Tailwind CSS, Administrate, Postgresql, Apache Arrow, DuckDB and GoGin. We appreciate the support and contributions from these open-source projects!

## Instanllation Guide

### Installing Go

1. Visit the [Go official download page](https://golang.org/dl/).

2. Download the Go installation package suitable for your operating system.

3. Follow the [Go installation guide](https://golang.org/doc/install) to set it up.

4. Verify that you've installed Go by opening a command prompt and typing the following command:

   ```shell
   go version
   ```

   Confirm that the command prints the installed version of Go.

### Installing Node.js and Yarn

1. Visit the [Node.js official website](https://nodejs.org/).

2. Download and install the LTS (Long Term Support) version suitable for your operating system.

3. Verify that you've installed Node.js by opening a command prompt and typing the following command:

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

### Setting Up Go Path

1. Select a directory to serve as your Go workspace (e.g., `~/go`).

2. Add the following to your shell configuration file (e.g., `.bashrc` or `.zshrc`) to set `GOPATH`.

   ```bash
   export GOPATH=$HOME/go
   export PATH=$PATH:$GOPATH/bin
   ```

3. Run one of the following commands to ensure the configuration file updates take effect.

   ```shell
   source ~/.bashrc
   # or
   source ~/.zshrc
   ```

4. Run the following command to verify that `GOPATH` is correctly set.

   ```shell
   go env GOPATH
   ```

   Confirm that the command prints your workspace directory, e.g., `/home/username/go`.

### Setting Environment Variables (Recommended with direnv)

1. Follow the [direnv official documentation](https://direnv.net/) for installation.

2. Add the following to your shell config file (e.g., `.bashrc`, `.zshrc`, etc.) to configure direnv.

   ```shell
   eval "$(direnv hook bash)"  # if using bash
   # or
   eval "$(direnv hook zsh)"   # if using zsh
   ```

   Reload your shell configuration file or restart your terminal.

3. In the project root directory, run the following command to create `.envrc` file.

   ```shell
   cp .envrc.example .envrc
   ```

4. Edit the `.envrc` file as needed and set necessary environment variables. For example:

   ```shell
   export CSGHUB_PORTAL_S3_ACCESS_KEY_ID=xxx
   export CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET=yyy
   # Add other required environment variables
   ```

5. In the project root directory, run the following command to allow direnv to load `.envrc` file.

   ```shell
   direnv allow .
   ```

### Getting Go Dependencies

Install the necessary Go modules by running:

```shell
go mod tidy
```

### Installing Air for Live Reloading

Air is a tool that allows live reloading of Go applications. Install it by running:

```shell
go install github.com/air-verse/air@latest
```

### Getting Frontend Dependencies

Navigate to the `frontend` directory and install dependencies using Yarn:

```shell
cd frontend
yarn install
```

### Setting Up the Database

1. Create a new database in your database system (PostgreSQL recommended):

   ```sql
   CREATE DATABASE your_database_name;
   ```

   Replace `your_database_name` with the actual database name you want to use.

2. Update your `.envrc` file with the correct database connection information.

3. Run the following command to initialize the database:

   ```shell
   go run cmd/csghub-portal/main.go migration init
   ```

4. Run the following command to perform database migration:

   ```shell
   go run cmd/csghub-portal/main.go migration migrate
   ```

## Startup Guide

### Starting Both Frontend and Backend Services

To start both frontend and backend services simultaneously, run the following command:

```shell
make
```

### Starting Frontend Service Only

To start only the frontend service, run the following command:

```shell
make run-frontend
```

### Starting Go Service Only

To start only the Go service, run the following command:

```shell
make run-backend
```

### Starting with VS Code

1. Create `.env` file:
   - In the project root directory, locate the `.env.example` file.
   - Copy `.env.example` and rename the copy to `.env`.
   - Open the `.env` file and configure the necessary environment variables for your environment.

   ```shell
   cp .env.example .env
   ```

2. Edit .env file:
   - Open the `.env` file with a text editor.
   - Modify each configuration item based on your development environment and requirements.
   - Ensure all necessary environment variables are set correctly.

3. In VS Code, open the "Run and Debug" view (typically the play button icon in the sidebar).

4. In the top dropdown menu, you can select one of the following configurations:
   - "portal": Start the main server
   - "init": Initialize the database
   - "migrate": Run database migration
   - "rollback": Rollback the database migration

### Building the Project via Command Line

1. Build the project:

   ```shell
   make build
   ```

2. Run the executable:

   ```shell
   ./csghub-portal start server
   ```

### Accessing the Application

Once both services are running, open your web browser and visit:

[http://localhost:8090](http://localhost:8090)

This will allow you to view and interact with the application.
