
[![Join WeChat Slack](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)
[![Join OpenCSG Slack](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
[![Join OpenCSG Discord](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)

**[简体中文](README_zh.md) ∙ [日本語](README_jp.md) ∙ [한국어](README_kr.md)**

## CSGHub

CSGHub is an open-source platform designed for managing Large Language Models (LLM) assets, offering an efficient way to handle the entire LLM and their assets such as datasets, spaces and codes etc. It allows users to upload, download, store, verify, and distribute LLM assets via a web interface, `git` command line, a natural language Chatbot, or [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk).

Additionally, CSGHub features microservice submodules and standardized OpenAPIs for seamless integration with existing systems. It aims to provide a user-friendly management platform specifically for LLM, which can be deployed On-Premise for secure, offline operation. Essentially, CSGHub serves as a private, on-premise version of Huggingface.

![CSGHub](./docs/images/csghub_framework.png)

### Key Features

- **Unified Management of LLM Assets**:  
  Provides a one-stop management solution for models, datasets, and code, supporting storage, version control, modifications, and queries. Supports uploading and downloading large files, along with online editing and preview on the Web, improving development and collaboration efficiency.

- **Flexible and Compatible Development Ecosystem**:  
  Supports both HTTPS and SSH protocols, enabling users to operate through Git commands or a web interface. The platform integrates popular SDKs such as Gradio and Streamlit, simplifying AI application development. It also offers one-click model inference and fine-tuning services with automatic environment optimization to ensure efficient deployment and operation.

- **Extended Capabilities for LLMs**:  
  Offers comprehensive version management, model format conversion, and automated data processing. Supports conversion tools for common data formats like CSV and JSON, and allows Web-based preview of Parquet datasets for quick data inspection.

- **Space and Asset Management Assistant (Copilot)**:  
  Users can demonstrate model capabilities, build prototypes, and manage applications flexibly through the Space. The Copilot assistant simplifies asset management and offers a private version to support on-premises deployment for enterprises.

- **Multi-Source Data Synchronization and Recommendation**:  
  Integrated with the OpenCSG community, allowing synchronization of community models and datasets. Provides personalized recommendations based on business scenarios, assisting enterprises in developing AI solutions tailored to their needs.

- **Comprehensive Permissions and Security Control**:  
  Supports integration with enterprise user systems, asset visibility settings, and internal-external interface authentication mechanisms. Ensures compliance through license verification and traceability, guaranteeing models adhere to legal requirements.

- **Support for On-Premises Deployment**:  
  Enables one-click on-premises deployment without relying on cloud services, ensuring enterprises retain full control and security over their data.

- **End-to-End Data Processing and Intelligent Annotation System**:  
  Provides customizable data processing pipelines for complex data cleaning and transformation tasks, leveraging parallel processing to accelerate workflows. Includes an intelligent annotation system, supporting multi-user collaboration and review to ensure data quality.

- **High Availability and Disaster Recovery Design**:  
  Adopts a high-availability architecture with load balancing and resource scheduling to ensure stability under high concurrency. Supports disaster recovery with redundant backups and snapshot technology, ensuring business continuity.

For further information, please see the [detailed introduction](./docs/detailed_intro_en.md) of CSGHub.

### Quick Start

- For those looking to quickly explore, experiment with CSGHub's free SaaS version on the [OpenCSG website](https://opencsg.com/models). Refer to this [brief quick start guide](./docs/csghub_saas_en.md) to handle LLMs/datasets and deploy LLM applications with CSGHub SaaS interface.
For more information, please refer to the [OpenCSG Documentation Center](https://opencsg.com/docs/en/intro).

- For those seeking a hands-on experience, you can quickly launch CSGHub on your local environment (Linux/MacOS/Windows) using the [Docker one-click deployment guide](https://github.com/OpenCSGs/csghub-installer/tree/main/docker), which allows you to start an all-in-one container with simplified commands and instantly experience the core functionalities of CSGHub.

- For those deploying on Kubernetes, refer to the [Helm Chart installation guide](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart) for step-by-step instructions.

### Roadmap

Discover the [roadmap](./docs/roadmap_en.md) outlining CSGHub's future direction.

### Release Notes

Refer to [release notes](./docs/release_notes.md) for information on feature improvements.

### Meetings & Contributing

We warmly invite you to explore the [OpenCSG Community](https://github.com/OpenCSGs/community), where you'll find comprehensive guides on becoming a vital part of the project.

- The process for joining [community meetings](https://github.com/OpenCSGs/community?tab=readme-ov-file#community-meeting), where you can engage with fellow members and share your ideas.
- Refer to the [contribution guide](https://github.com/OpenCSGs/community/blob/main/guidelines/CONTRIBUTING_en.md) for strategies on how to contribute to the project.
- [Contact us](https://github.com/OpenCSGs/community?tab=readme-ov-file#questions-and-issues) for any questions or issues, ensuring you're always supported throughout your journey with OpenCSG.
- Consult the [development guide](./docs/setup_en.md) for setting up the development environment.
