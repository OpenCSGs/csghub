# Backend Architecture

This document provides a technical overview of the CSGHub backend architecture, focusing on the server-side components that power the platform. This includes the web server, routing system, request handling, middleware, and the integration patterns with external services. For information about the frontend architecture, see [Frontend Architecture](#5).

## 1. Overview

The CSGHub backend is built using Go with the Gin web framework, providing high-performance HTTP request handling with a middleware-based architecture. The backend serves both API endpoints and server-rendered web pages, acting as the central coordination point between the user interface, database, and external services like S3 storage and the Starhub Server.

```mermaid
graph TD
    subgraph "CSGHub Backend"
        GinEngine["Gin Engine"]
        Router["Router"]
        Middleware["Middleware Chain"]
        Handlers["Handlers"]
        
        GinEngine --> Router
        Router --> Middleware
        Middleware --> Handlers
    end

    subgraph "External Services"
        StarhubServer["Starhub Server"]
        DB["Database"]
        S3["S3 Storage"]
    end

    subgraph "Clients"
        WebUI["Web UI"]
        GitCLI["Git CLI"]
        SDK["CSGHub SDK"]
    end

    WebUI --> GinEngine
    GitCLI --> GinEngine
    SDK --> GinEngine
    
    Handlers --> StarhubServer
    Handlers --> DB
    Handlers --> S3
```

Sources: [internal/routes/router.go:33-95]()

## 2. Router System

The router system uses Gin's group-based routing to organize endpoints by resource type and authentication requirements. The main router initialization happens in the `Initialize` function, which sets up the server, configures logging, and registers routes.

### 2.1 Router Initialization

The router initialization process follows these steps:

1. Create a new Gin engine
2. Configure trusted proxies and logging
3. Register global middleware
4. Initialize handler registries
5. Set up static file serving
6. Register API and view routes
7. Configure 404 handling

```mermaid
sequenceDiagram
    participant App as "Application"
    participant Router as "Router"
    participant Handlers as "Handlers Registry"
    participant Middleware as "Middleware"
    
    App->>Router: Initialize(svcCtx)
    Router->>Router: Create Gin Engine
    Router->>Router: Configure Logging
    Router->>Middleware: Register Global Middleware
    Router->>Handlers: Initialize Handler Registries
    Router->>Router: setupStaticRouter()
    Router->>Router: setupApiRouter()
    Router->>Router: setupViewsRouter()
    Router->>Router: setupNotFoundRouter()
    Router-->>App: Return Configured Gin Engine
```

Sources: [internal/routes/router.go:33-95]()

### 2.2 Route Organization

Routes are organized by resource type (models, datasets, codes, spaces, etc.) and are registered in separate functions. Each resource type has its own route group, and routes are further divided into public and authenticated routes.

```mermaid
graph TD
    Router["Router"]
    
    Router --> ApiRoutes["API Routes (/internal_api)"]
    Router --> ModelRoutes["Model Routes (/models)"]
    Router --> DatasetRoutes["Dataset Routes (/datasets)"]
    Router --> CodeRoutes["Code Routes (/codes)"]
    Router --> SpaceRoutes["Space Routes (/spaces)"]
    Router --> EndpointRoutes["Endpoint Routes"]
    Router --> FinetuneRoutes["Finetune Routes"]
    Router --> OrgRoutes["Organization Routes"]
    
    subgraph "Common Route Pattern"
        PublicRoutes["Public Routes"]
        AuthRoutes["Authenticated Routes"]
        
        AuthMiddleware["Auth Middleware"]
        
        PublicRoutes --> ResourceHandler["Resource Handler"]
        AuthRoutes --> AuthMiddleware
        AuthMiddleware --> ResourceHandler
    end
```

Sources: [internal/routes/router.go:205-230](), [internal/routes/models.go](), [internal/routes/datasets.go](), [internal/routes/codes.go](), [internal/routes/spaces.go]()

## 3. Middleware System

The Gin framework's middleware pattern is used extensively in CSGHub to handle cross-cutting concerns like authentication, logging, and error handling. Middleware is registered globally for the entire application and can also be applied to specific route groups.

### 3.1 Global Middleware

The following middleware is applied globally to all requests:

1. Error recovery middleware (with custom logging)
2. Authentication middleware
3. Cache control middleware
4. Request logging middleware

```mermaid
graph LR
    Request["HTTP Request"]
    Response["HTTP Response"]
    
    Request --> Recovery["Error Recovery Middleware"]
    Recovery --> Auth["Authentication Middleware"]
    Auth --> Cache["Cache Control Middleware"]
    Cache --> Logger["Request Logging Middleware"]
    Logger --> Handler["Route Handler"]
    Handler --> Response
```

Sources: [internal/routes/router.go:61-72]()

### 3.2 Route-Specific Middleware

For protected routes, additional middleware is applied to check if a user is authenticated before allowing access to specific resources.

```mermaid
flowchart LR
    Request["HTTP Request to Protected Route"]
    CheckUser["CheckCurrentUser Middleware"]
    Handler["Route Handler"]
    Unauthorized["401 Unauthorized"]
    
    Request --> CheckUser
    CheckUser -- "User Authenticated" --> Handler
    CheckUser -- "User Not Authenticated" --> Unauthorized
```

Sources: [internal/routes/models.go:22-23](), [internal/routes/datasets.go:16-17](), [internal/routes/codes.go:22-23](), [internal/routes/spaces.go:16-17]()

## 4. Handler Architecture

The handler architecture follows a hierarchical pattern with handler registries that manage related handlers. Handlers are organized into interfaces and implementations, with common functionality extracted into base handlers.

### 4.1 Handler Registries

Handler registries serve as collections of related handlers and are initialized during application startup. There are two main types of handler registries:

1. `FrontendHandlerRegistry` - Handles API requests
2. `RenderHandlerRegistry` - Handles view rendering

```mermaid
classDiagram
    class HandlersRegistry {
        +FrontendHandlers: FrontendHandlerRegistry
        +RenderHandler: RenderHandlerRegistry
        +Config: Config
    }
    
    class RenderHandlerRegistry {
        +ErrorHandler: ErrorHandler
        +ModelHandler: ModelHandler
        +DatasetHandler: DatasetHandler
        +CodeHandler: CodeHandler
        +SpaceHandler: SpaceHandler
        +EndpointHandler: EndpointHandler
        +FinetuneHandler: FinetuneHandler
        +SessionHandler: SessionHandler
        +OrganizationHandler: OrganizationHandler
        +CollectionsHandler: CollectionsHandler
        +ProfileHandler: ProfileHandler
        +SettingHandler: SettingHandler
        +AdminHandler: AdminHandler
        +ResourceConsoleHandler: ResourceConsoleHandler
        +PromptsHandler: PromptsHandler
        +EvaluationHandler: EvaluationHandler
    }
    
    HandlersRegistry *-- RenderHandlerRegistry
```

Sources: [internal/routes/router.go:26-31](), [internal/handlers/render/registry.go:9-26]()

### 4.2 Base Handler Pattern

Resource handlers follow a base handler pattern, where common functionality is implemented in a base handler and specialized behavior is added in resource-specific handlers.

```mermaid
classDiagram
    class BaseHandler {
        <<interface>>
        +List(ctx)
        +Detail(ctx)
        +Files(ctx)
        +Blob(ctx)
        +Commits(ctx)
        +Commit(ctx)
        +NewFile(ctx)
        +UploadFile(ctx)
        +EditFile(ctx)
        +Settings(ctx)
        +Billing(ctx)
        +Logs(ctx)
        +Community(ctx)
        +New(ctx)
    }
    
    class BaseHandlerImpl {
        -resourceType: string
        +List(ctx)
        +Detail(ctx)
        +Files(ctx)
        +Blob(ctx)
        +Commits(ctx)
        +Commit(ctx)
        +NewFile(ctx)
        +UploadFile(ctx)
        +EditFile(ctx)
        +Settings(ctx)
        +Billing(ctx)
        +Logs(ctx)
        +Community(ctx)
        +New(ctx)
        -renderShow(ctx, actionName, defaultTab, extraData)
        -addResourceSpecificData(ctx, data)
    }
    
    class ModelHandler {
        <<interface>>
    }
    
    class DatasetHandler {
        <<interface>>
    }
    
    class CodeHandler {
        <<interface>>
    }
    
    class SpaceHandler {
        <<interface>>
    }
    
    BaseHandler <|.. BaseHandlerImpl
    BaseHandler <|-- ModelHandler
    BaseHandler <|-- DatasetHandler
    BaseHandler <|-- CodeHandler
    BaseHandler <|-- SpaceHandler
    
    ModelHandler <|.. ModelHandlerImpl
    DatasetHandler <|.. DatasetHandlerImpl
    CodeHandler <|.. CodeHandlerImpl
    SpaceHandler <|.. SpaceHandlerImpl
    
    BaseHandlerImpl <|-- ModelHandlerImpl
    BaseHandlerImpl <|-- DatasetHandlerImpl
    BaseHandlerImpl <|-- CodeHandlerImpl
    BaseHandlerImpl <|-- SpaceHandlerImpl
```

Sources: [internal/handlers/render/repo.go:39-163](), [internal/handlers/render/models.go](), [internal/handlers/render/datasets.go](), [internal/handlers/render/codes.go](), [internal/handlers/render/spaces.go]()

## 5. Authentication and Session Management

CSGHub uses JWT (JSON Web Tokens) for authentication and session management. The JWT contains user information and is used to authenticate requests to protected resources.

### 5.1 JWT Token Flow

The JWT token system works as follows:

1. User logs in and receives a JWT token
2. Token is stored in a cookie and used for subsequent requests
3. Token can be refreshed to extend the session
4. Token contains user information, including permissions and organizations

```mermaid
sequenceDiagram
    participant User
    participant CSGHub as "CSGHub Backend"
    participant Server as "Starhub Server"
    
    User->>CSGHub: Login Request
    CSGHub->>Server: Create JWT Token Request
    Server-->>CSGHub: JWT Token Response
    CSGHub->>CSGHub: Set Cookie with Token
    CSGHub-->>User: Login Response with Token
    
    User->>CSGHub: Protected Resource Request
    CSGHub->>CSGHub: Verify Token in Middleware
    CSGHub-->>User: Protected Resource Response
    
    User->>CSGHub: Refresh Token Request
    CSGHub->>Server: Create New JWT Token
    Server-->>CSGHub: New JWT Token
    CSGHub->>CSGHub: Update Cookie
    CSGHub-->>User: New Token Response
```

Sources: [internal/handlers/frontend/token.go:34-59](), [pkg/server/types/jwt.go]()

### 5.2 Authentication Middleware

The authentication middleware is responsible for verifying JWT tokens and extracting user information for protected routes. 

Table: Authentication Middleware Components

| Component | Description |
|-----------|-------------|
| `AuthMiddleware` | Main middleware that validates JWT tokens |
| `CheckCurrentUser` | Ensures a user is authenticated for protected routes |
| `JwtUtils` | Utility for working with JWT tokens |
| `GetCurrentUser` | Extracts user information from JWT token |

Sources: [internal/routes/router.go:69](), [internal/routes/models.go:23](), [internal/handlers/frontend/token.go:35]()

## 6. View Rendering

CSGHub uses server-side rendering with Go templates for HTML views. The template system is configured to use layouts and partials for consistent page structure.

### 6.1 Template System

The template system uses the `multitemplate.Renderer` to manage templates with layouts and partials:

```mermaid
graph TD
    subgraph "Template System"
        TemplateRenderer["multitemplate.Renderer"]
        Layouts["Layouts (base, navbar, footer)"]
        Pages["Page Templates"]
        
        TemplateRenderer --> Layouts
        TemplateRenderer --> Pages
        
        Handler["Render Handler"] --> TemplateRenderer
    end
    
    subgraph "Route Handling"
        Request["HTTP Request"]
        Router["Router"]
        RenderFunction["RenderTemplate Function"]
        
        Request --> Router
        Router --> Handler
        Handler --> RenderFunction
        RenderFunction --> TemplateRenderer
    end
```

Sources: [internal/routes/router.go:106-203]()

## 7. Static File Serving

The backend serves static files from the embedded frontend distribution. Files are served from memory without requiring external file access.

```mermaid
graph LR
    subgraph "Static File Serving"
        Request["Static File Request"]
        FileServer["http.FileServer"]
        EmbeddedFS["Embedded FS (frontend.Dist)"]
        
        Request --> StaticMiddleware["Static File Middleware"]
        StaticMiddleware --> FileServer
        FileServer --> EmbeddedFS
        EmbeddedFS --> Response["File Response"]
    end
```

Sources: [internal/routes/router.go:232-250]()

## 8. API Integration

The backend provides internal API endpoints for use by the frontend, using a consistent pattern for API responses.

### 8.1 Internal API Endpoints

The internal API endpoints are registered in the `setupApiRouter` function and include:

- `/internal_api/ping` - Health check endpoint
- `/internal_api/users/jwt_token` - Token refresh endpoint
- `/internal_api/upload` - File upload endpoint

```mermaid
graph TD
    subgraph "Internal API"
        ApiGroup["/internal_api"]
        Ping["/ping (PingHandler.Ping)"]
        JwtToken["/users/jwt_token (TokenHandler.RefreshToken)"]
        Upload["/upload (UploadHandler.Create)"]
        
        ApiGroup --> Ping
        ApiGroup --> JwtToken
        ApiGroup --> Upload
    end
    
    subgraph "Other Endpoints"
        Resolve["/:repo_type/:namespace/:name/resolve/:branch/*path"]
        Locale["/zh|en/settings/locale"]
    end
```

Sources: [internal/routes/router.go:252-265]()

## 9. Error Handling

The backend includes comprehensive error handling with custom recovery middleware and structured logging.

```mermaid
flowchart TD
    Request["HTTP Request"]
    
    subgraph "Error Handling System"
        RecoveryMiddleware["Custom Recovery Middleware"]
        ErrorLogging["Structured Error Logging (slog)"]
        ErrorResponse["Error Response Generation"]
    end
    
    Request --> RecoveryMiddleware
    RecoveryMiddleware -- "No Error" --> Handler["Route Handler"]
    RecoveryMiddleware -- "Error Occurs" --> ErrorLogging
    ErrorLogging --> ErrorResponse
    ErrorResponse --> Response["HTTP 500 Response"]
    
    Handler -- "Handler Error" --> ErrorLogging
```

Sources: [internal/routes/router.go:61-68]()

## Conclusion

The CSGHub backend architecture follows a well-structured design pattern based on the Gin web framework. It uses middleware extensively for cross-cutting concerns, implements a hierarchical handler structure for code reuse, and provides both API endpoints and server-rendered views. The authentication system is based on JWT tokens, and the template system uses layouts and partials for consistent page rendering.

This architecture enables the backend to efficiently handle a variety of request types while maintaining separation of concerns between authentication, routing, and business logic.