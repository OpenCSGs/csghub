# Release Notes

- **[2025.01.15] v1.3.0**
  Added tag management in the admin panel, sign-in redirection, and support for filtering by multiple tags on model, dataset, and code pages. Introduced multi sync proxy configuration via server config file, SGLang support for improved inference engine performance, updated Swift image for fine-tuning, and enabled public dataset creation via API. Refactored code for better quality and added additional tests for stability.
- **[2024.12.15] v1.2.0**
  Resolved a security vulnerability; all users are strongly recommended to update. Added model evaluation feature for comparing AI models, supporting opencompass and LLM evaluation harness. For self-hosted Kubernetes users, manual Argo Workflow installation is required for model evaluation. Redesigned admin UI layout for better usability, standardized component styles for consistency, and improved page responsiveness for mobile and desktop. Introduced the Prompt Library for creating and managing reusable prompts in OpenCSG.
- **[2024.11.15] v1.1.0**
  Enhanced multi-sync features with updated branch handling and callbacks for tagging, info updates, and scans. Admin dashboard improvements include user account deletion, excluding owners of organizations or resources, and mirror progress tracking. Added ms-swift fine-tuning support and new prompt-type repo for prompt management and dataset optimization. Changed user info retrieval to backend service. Bug fixes for organizational access, repo settings, repo tags filter, and collection addition. Repo now supports non-default branches. Added comment timestamps for community topics. Logout support via /logout included.
- **[2024.10.15] v1.0.0**
  Big release to make multi-sync a stable function, support docker image build for ARM platform, support regions for space creation, auto generate resource type of models like Nvidia GPU，Huawei Ascend, auto build repo and runtime frameworks relation, support model inference with NIM, allow filter by subset and splits in dataset viewer, enable auto init of user git access token
- **[2024.09.15] v0.9.0**
  `CSGHub` portal has been migrated to the Go version, with Gitaly support enabled by default on the Git server. New features include the 'Collections' feature and the Resource Console page. Running spaces, model inference, and fine-tuning endpoints no longer requires a domain name. Additionally, various user experience improvements and bug fixes have been implemented.
- **[2024.08.15] v0.8.0**
  Big release to introduce a standalone `user_server` service and move user, org, token management from `CSGHub` to backend server `CSGHub-server`, introduce a standalone `starhub_server_runner service` for uniformed deployment of Application Space, Mode Inference and Finetune. Resource management enchanced, multiple k8s clusters in different regions are not supported.
- **[2024.07.15] v0.7.0**
  Big release to support `Multiple Resource Sync` for models and datasets, One-Click Fintune, Resource Usage Metering.
- **[2024.06.21] v0.6.1**
  Bug fix and user experience enhancement.
- **[2024.06.18] v0.6.0**
  Big release to support `dedicated` model inference endpoint, support `streamlit` Space, allow use to `like` repos allow to set repo's `industry tag`, enhance git history and commit diff details.
- **[2024.05.14] v0.5.0**
  Enhance Space user experience, auto build `relations` between repos(model, dataset, code and spaces), support multiple files uploading.
- **[2024.04.18] v0.4.0**
  Allow to run `Application Space` (gradio app), add a widget to try model inference, support new repo type `Code`, support organization members management, support wechat login.
- **[2024.03.15] v0.3.0**
  Plan: Files online editing, organization edit, dataset preview.
- **[2024.02.15] v0.2.0**
  Improve the function of model dataset hosting, and add the feature of inviting new organization members.
- **[2024.01.15] v0.1.0**
  `CSGHub` Alpha version release, supports model and dataset management functions.
