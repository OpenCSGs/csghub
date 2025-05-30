# Model Deployment and Fine-tuning

This document covers the systems and processes for deploying models as inference endpoints and fine-tuning models in CSGHub. It explains how to create, configure, and manage both inference endpoints and fine-tuning jobs, as well as how to evaluate models.

For repository management details, see [Repository Management System](#2).

## Overview

CSGHub provides three main AI model operations:

1. **Model Deployment** - Deploy models as inference endpoints for real-time prediction
2. **Model Fine-tuning** - Customize pre-trained models with your own data
3. **Model Evaluation** - Measure model performance with standardized metrics

These operations share common infrastructure components but serve different purposes in the ML lifecycle.

```mermaid
flowchart TD
    User(["User"])
    
    subgraph "Model Operations"
        Deploy["Model Deployment"]
        Finetune["Model Fine-tuning"]
        Evaluate["Model Evaluation"]
    end
    
    subgraph "Shared Components"
        Resources["Resource Management"]
        Frameworks["Runtime Frameworks"]
        EngineArgs["Engine Arguments"]
    end
    
    subgraph "Infrastructure"
        Clusters["Cluster Management"]
        Hardware["Hardware Provisioning"]
        Scaling["Replica Scaling"]
    end
    
    User --> Deploy
    User --> Finetune
    User --> Evaluate
    
    Deploy --> Resources
    Finetune --> Resources
    Evaluate --> Resources
    
    Deploy --> Frameworks
    Finetune --> Frameworks
    Evaluate --> Frameworks
    
    Deploy --> EngineArgs
    Finetune --> EngineArgs
    
    Resources --> Clusters
    Resources --> Hardware
    Deploy --> Scaling
```

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:1-611]()
- [frontend/src/components/finetune/NewFinetune.vue:1-416]()
- [frontend/src/components/evaluations/NewEvaluation.vue:1-553]()
- [frontend/src/components/endpoints/EngineArgs.vue:1-128]()

## Inference Endpoint System

Inference endpoints provide a deployable API for using models in production. The endpoint system handles deployment configuration, resource allocation, and replica scaling.

### Creating an Endpoint

The endpoint creation flow allows users to deploy a model with specific hardware resources and runtime parameters:

```mermaid
sequenceDiagram
    participant User
    participant NewEndpoint as "NewEndpoint Component"
    participant API as "Backend API"
    participant ResourceSystem as "Resource System"
    participant ClusterSystem as "Cluster System"
    
    User->>NewEndpoint: Enter endpoint name and model ID
    NewEndpoint->>API: fetchModels(query)
    API-->>NewEndpoint: Return matching models
    
    User->>NewEndpoint: Select cluster region
    NewEndpoint->>API: fetchClusters()
    API-->>NewEndpoint: Return available clusters
    NewEndpoint->>API: fetchResources(clusterId)
    API-->>NewEndpoint: Return available hardware resources
    
    User->>NewEndpoint: Select hardware resource
    User->>NewEndpoint: Configure min/max replicas
    
    NewEndpoint->>API: fetchRuntimeFramework(modelId)
    API-->>NewEndpoint: Return compatible frameworks
    User->>NewEndpoint: Select runtime framework
    
    opt Framework has custom parameters
        NewEndpoint->>NewEndpoint: Display EngineArgs component
        User->>NewEndpoint: Configure framework parameters
    end
    
    opt Model has quantization options
        NewEndpoint->>API: fetchQuantizations(modelId)
        API-->>NewEndpoint: Return available quantizations
        User->>NewEndpoint: Select quantization option
    end
    
    User->>NewEndpoint: Set visibility (public/private)
    User->>NewEndpoint: Click Create
    
    NewEndpoint->>API: createEndpoint(params)
    API-->>NewEndpoint: Return deployment status
    NewEndpoint-->>User: Redirect to endpoint detail page
```

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:1-611]()
- [frontend/src/components/endpoints/EngineArgs.vue:1-128]()

The form allows configuration of:

| Parameter | Description | Default |
|-----------|-------------|---------|
| Endpoint name | Unique identifier for the endpoint | - |
| Model ID | The model to deploy | - |
| Min Replicas | Minimum number of running instances | 1 |
| Max Replicas | Maximum number of instances for scaling | 1 |
| Cluster | Region for deployment | First available |
| Cloud Resource | Hardware resource type | First available |
| Runtime Framework | Inference framework | Model-dependent |
| Engine Arguments | Framework-specific parameters | Framework defaults |
| Quantization | Optional model quantization | None |
| Visibility | Public or private access | Public |

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:16-265]()
- [frontend/src/locales/en_js/endpoints.js:1-90]()

### Managing Endpoints

The endpoint settings interface provides controls for managing deployed endpoints:

```mermaid
graph TD
    subgraph "EndpointSettings Component"
        StopAction["Stop Endpoint"]
        RestartAction["Restart Endpoint"]
        ResourceConfig["Change Resource Configuration"]
        FrameworkConfig["Change Runtime Framework"]
        EngineConfig["Update Engine Arguments"]
        ReplicaConfig["Adjust Min/Max Replicas"]
        VisibilityConfig["Change Visibility"]
        DeleteAction["Delete Endpoint"]
    end
    
    subgraph "Endpoint API Actions"
        StopAPI["stopEndpoint()"]
        RestartAPI["restartEndpoint()"]
        UpdateAPI["updateEndpoint(payload)"]
        DeleteAPI["deleteEndpoint()"]
    end
    
    StopAction --> StopAPI
    RestartAction --> RestartAPI
    
    ResourceConfig --> UpdateAPI
    FrameworkConfig --> UpdateAPI
    EngineConfig --> UpdateAPI
    ReplicaConfig --> UpdateAPI
    VisibilityConfig --> UpdateAPI
    
    DeleteAction --> DeleteAPI
    
    UpdateAPI --> RefreshEndpoint["Refresh Endpoint Data"]
```

Sources:
- [frontend/src/components/endpoints/EndpointSettings.vue:1-573]()

Key management operations include:

1. **State Management**: Stop, start, and restart the endpoint
2. **Resource Management**: Change the hardware resources (only when stopped)
3. **Framework Configuration**: Change the runtime framework and engine arguments
4. **Scaling Configuration**: Adjust the minimum and maximum replicas
5. **Visibility Control**: Toggle between public and private access
6. **Deletion**: Permanently remove the endpoint

Sources:
- [frontend/src/components/endpoints/EndpointSettings.vue:24-276]()

### Endpoint Lifecycle and States

The endpoint goes through several states during its lifecycle:

| State | Description | Actions Available |
|-------|-------------|-------------------|
| Building | Initial build process | None |
| Deploying | Deployment in progress | None |
| Startup | Starting the service | None |
| Running | Active and serving requests | Stop, monitoring |
| Stopped | Endpoint is paused | Start, configure, delete |
| Sleeping | Low-activity state | Start |
| BuildingFailed | Build process failed | Restart, delete |
| DeployFailed | Deployment failed | Restart, delete |
| RuntimeError | Error during operation | Restart, delete |
| NoAppFile | Missing application file | Delete |

Sources:
- [frontend/src/components/endpoints/EndpointSettings.vue:334-354]()
- [frontend/src/components/endpoints/EndpointPage.vue:1-142]()

## Fine-tuning System

The fine-tuning system allows users to customize pre-trained models with their own data.

### Creating a Fine-tuning Job

```mermaid
graph TD
    subgraph "NewFinetune Component"
        ModelSelection["Select Base Model"]
        NameConfig["Configure Job Name"]
        ClusterSelection["Select Region/Cluster"]
        ResourceSelection["Select Hardware Resource"]
        FrameworkSelection["Select Runtime Framework"]
    end
    
    subgraph "API Interactions"
        FetchModels["fetchModels()"]
        FetchClusters["fetchClusters()"]
        FetchResources["fetchResources(clusterId)"]
        FetchFrameworks["fetchRuntimeFramework(modelId)"]
        CreateFinetune["submitFinetuneForm()"]
    end
    
    ModelSelection --> FetchModels
    ModelSelection --> FetchFrameworks
    
    ClusterSelection --> FetchClusters
    ClusterSelection --> FetchResources
    
    ResourceSelection --> FilterFrameworks["Filter compatible frameworks"]
    
    ModelSelection & NameConfig & ClusterSelection & ResourceSelection & FrameworkSelection --> CreateFinetune
    
    CreateFinetune --> Redirect["Redirect to finetune detail page"]
```

Sources:
- [frontend/src/components/finetune/NewFinetune.vue:1-416]()

The fine-tuning form allows configuration of:

| Parameter | Description | Default |
|-----------|-------------|---------|
| Job Name | Name for the fine-tuning job | - |
| Model ID | Base model to fine-tune | - |
| Cluster | Region for fine-tuning | First available |
| Cloud Resource | Hardware resource (GPU required) | First available |
| Runtime Framework | Fine-tuning framework | Model-dependent |

Sources:
- [frontend/src/components/finetune/NewFinetune.vue:16-164]()

### Managing Fine-tuning Jobs

The fine-tuning settings interface provides controls similar to endpoint management:

1. **State Management**: Stop and restart the fine-tuning job
2. **View Configuration**: Examine the resource allocation and framework settings
3. **Deletion**: Permanently remove the fine-tuning job

Fine-tuning jobs share the same lifecycle states as endpoints (Building, Running, Stopped, etc.).

Sources:
- [frontend/src/components/finetune/FinetuneSettings.vue:1-387]()

## Model Evaluation System

The evaluation system allows users to measure model performance against standard benchmarks.

### Creating an Evaluation

```mermaid
graph TD
    subgraph "NewEvaluation Component"
        NameConfig["Configure Evaluation Name"]
        ModelSelection["Select Model to Evaluate"]
        DescConfig["Add Description"]
        DatasetSelection["Select Evaluation Datasets"]
        ResourceTypeSelection["Choose Resource Type"]
        
        subgraph "For Dedicated Resources"
            ClusterSelection["Select Region/Cluster"]
            ResourceSelection["Select Hardware Resource"]
        end
        
        FrameworkSelection["Select Evaluation Framework"]
    end
    
    subgraph "API Interactions"
        FetchModels["fetchModels()"]
        FetchDatasets["fetchDatasetOptions()"]
        FetchClusters["fetchClusters()"]
        FetchResources["fetchResources()"]
        FetchFrameworks["fetchRuntimeFramework()"]
        SubmitEvaluation["handleSubmit()"]
    end
    
    ModelSelection --> FetchModels
    ModelSelection --> FetchFrameworks
    FrameworkSelection --> FetchDatasets
    
    ResourceTypeSelection --> ResourceTypeDecision{"Dedicated or Shared?"}
    ResourceTypeDecision -->|"Dedicated"| ClusterSelection
    ClusterSelection --> FetchClusters
    ClusterSelection --> FetchResources
    
    NameConfig & ModelSelection & DescConfig & DatasetSelection & ResourceTypeSelection & FrameworkSelection --> SubmitEvaluation
    ResourceTypeDecision -->|"Dedicated"| ResourceSelection --> SubmitEvaluation
    
    SubmitEvaluation --> Redirect["Redirect to resource console"]
```

Sources:
- [frontend/src/components/evaluations/NewEvaluation.vue:1-553]()

The evaluation form allows configuration of:

| Parameter | Description | Required |
|-----------|-------------|----------|
| Evaluation Name | Name for the evaluation task | Yes |
| Model ID | Model to evaluate | Yes |
| Description | Purpose and notes for evaluation | No |
| Datasets | Evaluation datasets (filtered by framework) | Yes |
| Resource Type | Shared (pooled) or Dedicated resources | Yes |
| Cluster | Region (for dedicated resources) | Conditional |
| Cloud Resource | Hardware (for dedicated resources) | Conditional |
| Evaluation Framework | Framework for running evaluations | Yes |

Sources:
- [frontend/src/components/evaluations/NewEvaluation.vue:16-244]()

## Shared Components and Infrastructure

### Engine Arguments System

The Engine Arguments component allows configuration of framework-specific parameters for both endpoints and fine-tuning jobs:

```mermaid
graph TD
    subgraph "EngineArgs Component"
        ArgsCollapse["Expandable Parameter Section"]
        ArgsInputs["Parameter Input Fields"]
    end
    
    subgraph "Input Types"
        TextInput["Text Input Fields"]
        SelectInput["Select Dropdowns"]
        SwitchInput["Toggle Switches"]
    end
    
    subgraph "Parameters Management"
        ArgValues["Current Parameter Values"]
        ChangedArgs["Track Changed Parameters"]
        EmitChanges["Emit Updates to Parent"]
    end
    
    ArgsCollapse --> ArgsInputs
    ArgsInputs --> TextInput & SelectInput & SwitchInput
    
    TextInput & SelectInput & SwitchInput --> HandleChange["handleChange()"]
    HandleChange --> ChangedArgs
    ChangedArgs --> EmitChanges
    
    useEngineArgs["getInputTypeForEngineArg()"] --> SelectInput & SwitchInput & TextInput
```

Sources:
- [frontend/src/components/endpoints/EngineArgs.vue:1-128]()
- [frontend/src/packs/useEngineArgs.js:1-55]()

The component intelligently selects input types based on parameter names and values:

| Input Type | Used For | Example Parameters |
|------------|----------|-------------------|
| Select Dropdown | Parameters with predefined options | `block-size`, `dtype`, `load-format` |
| Toggle Switch | Boolean parameters | `enable-prefix-caching`, `enforce-eager` |
| Text Input | All other parameters | Custom values, numeric settings |

Sources:
- [frontend/src/packs/useEngineArgs.js:1-55]()

### Resource and Cluster Management

All three systems (deployment, fine-tuning, evaluation) share common resource selection and cluster management:

```mermaid
graph TD
    subgraph "Resource Selection Flow"
        SelectCluster["Select Cluster/Region"]
        FetchResources["fetchResourcesInCategory()"]
        FilterResources["Filter By Operation Type"]
        DisplayResources["Display Available Resources"]
        SelectResource["Select Resource"]
        FilterFrameworks["Filter Compatible Frameworks"]
    end
    
    SelectCluster --> FetchResources
    FetchResources --> FilterResources
    FilterResources --> DisplayResources
    DisplayResources --> SelectResource
    SelectResource --> FilterFrameworks
    
    subgraph "Resource Categories"
        CPU["CPU Resources"]
        GPU["GPU Resources"] 
        Premium["Premium Resources"]
    end
    
    subgraph "Operation Types"
        DeployType["Deployment (Type 1)"]
        FinetuneType["Fine-tuning (Type 2)"]
        EvalType["Evaluation (Type 4)"]
    end
    
    FilterResources --> CPU & GPU & Premium
    DeployType & FinetuneType & EvalType --> FilterResources
```

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:397-408]()
- [frontend/src/components/finetune/NewFinetune.vue:257-269]()
- [frontend/src/components/evaluations/NewEvaluation.vue:380-390]()

Key aspects of resource management:

1. **Clusters**: Geographic regions where resources are deployed
2. **Resource Types**: Hardware configurations (CPU/GPU/specialized accelerators)
3. **Framework Compatibility**: Filtering frameworks based on selected resources
4. **Operation Types**: Different operations (deployment, fine-tuning, evaluation) filter for appropriate resources

Sources:
- [frontend/src/components/shared/deploy_instance/fetchResourceInCategory.js]() (referenced but not shown in provided files)

## Integration with Repository System

The deployment and fine-tuning systems integrate with the repository management system:

1. **Model Selection**: Deployed endpoints and fine-tuning jobs use models from the repository
2. **Dataset Selection**: Evaluations and fine-tuning use datasets from the repository
3. **Visibility Control**: Aligns with repository visibility settings (public/private)

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:246-252]()
- [frontend/src/components/endpoints/EndpointSettings.vue:185-224]()

## User Interface and Localization

The system provides a fully localized interface with support for both English and Chinese:

```mermaid
graph TD
    subgraph "UI Components"
        NewEndpoint["NewEndpoint.vue"]
        EndpointSettings["EndpointSettings.vue"]
        NewFinetune["NewFinetune.vue"]
        NewEvaluation["NewEvaluation.vue"]
    end
    
    subgraph "Localization System"
        EN["English Locales"]
        ZH["Chinese Locales"]
        I18n["Vue i18n"]
    end
    
    ZH --> I18n
    EN --> I18n
    
    I18n --> NewEndpoint
    I18n --> EndpointSettings
    I18n --> NewFinetune
    I18n --> NewEvaluation
```

Sources:
- [frontend/src/locales/en_js/endpoints.js:1-90]()
- [frontend/src/locales/zh_js/endpoints.js:1-90]()

## API Integration

All model operations interact with backend API endpoints:

| Operation | API Endpoint | HTTP Method |
|-----------|--------------|-------------|
| Create Endpoint | `/models/{modelId}/run` | POST |
| Update Endpoint | `/models/{modelId}/run/{endpointId}` | PUT |
| Stop Endpoint | `/models/{modelId}/run/{endpointId}/stop` | PUT |
| Start Endpoint | `/models/{modelId}/run/{endpointId}/start` | PUT |
| Delete Endpoint | `/models/{modelId}/run/{endpointId}` | DELETE |
| Create Fine-tune | `/models/{modelId}/finetune` | POST |
| Update Fine-tune | `/models/{modelId}/finetune/{finetuneId}` | PUT |
| Stop Fine-tune | `/models/{modelId}/finetune/{finetuneId}/stop` | PUT |
| Start Fine-tune | `/models/{modelId}/finetune/{finetuneId}/start` | PUT |
| Delete Fine-tune | `/models/{modelId}/finetune/{finetuneId}` | DELETE |
| Create Evaluation | `/evaluations` | POST |

Sources:
- [frontend/src/components/endpoints/NewEndpoint.vue:550-553]()
- [frontend/src/components/endpoints/EndpointSettings.vue:398-400]()
- [frontend/src/components/finetune/NewFinetune.vue:353-359]()
- [frontend/src/components/finetune/FinetuneSettings.vue:285-288]()
- [frontend/src/components/evaluations/NewEvaluation.vue:472-473]()

## Summary

The Model Deployment and Fine-tuning systems in CSGHub provide comprehensive capabilities for operationalizing AI models through:

1. **Inference Endpoints** for real-time predictions
2. **Fine-tuning Jobs** for customizing models with specialized data
3. **Evaluation Tasks** for measuring model performance

These systems share common infrastructure components including resource management, runtime frameworks, and engine argument configuration, while providing specialized interfaces for each operation type.