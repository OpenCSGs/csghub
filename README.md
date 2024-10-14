
[![Join WeChat Slack](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)
[![Join OpenCSG Slack](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
[![Join OpenCSG Discord](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)

**[简体中文](/docs/readme_cn.md) ∙ [日本語](/docs/readme_ja.md) ∙ [한국어](/docs/readme_kr.md)**

## CSGHub

CSGHub is an open-source platform designed for managing Large Language Models (LLM) assets, offering an efficient way to handle the entire LLM and their assets such as datasets, spaces and codes etc. It allows users to upload, download, store, verify, and distribute LLM assets via a web interface, `git` command line, a natural language Chatbot, or [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk). 

Additionally, CSGHub features microservice submodules and standardized OpenAPIs for seamless integration with existing systems. It aims to provide a user-friendly management platform specifically for LLM, which can be deployed On-Premise for secure, offline operation. Essentially, CSGHub serves as a private, on-premise version of Huggingface. 

![CSGHub](./docs/images/csghub_framework.png)


### Key Features
- **Unified Management of LLM Assets**: A one-stop Hub for unified management of model files, datasets, and large-scale model application codes.
- **Development Ecosystem Compatibility**: Supports both HTTPS and SSH protocols for Git commands and web interface operations, ensuring convenient usage for different users.
- **Large Model Capability Expansion**: Natively supports version management, model format conversion, automatic data processing, and dataset preview functions.
- **Permissions and Security**: Supports integration with corporate user systems, setting of asset visibility, and zero-trust authentication interface design for both external and internal users, maximizing security.
- **Support for Private Deployment**: Independent of internet and cloud vendors, enabling one-click initiation of private deployment.
- **Native Design for Large Models**: Supports natural language interaction, one-click model deployment, and asset management for Agent and Copilot App.

For further information, please see the [detailed introduction](./docs/detailed_intro_en.md) of CSGHub.

### Quick Start

- For a quick try, explore CSGHub's free SaaS version at the [OpenCSG website](https://opencsg.com/models).

- For a hands-on experience, refer to the [installation guide](https://github.com/OpenCSGs/csghub-installer/tree/main/docker-compose/csghub) to quickly deploy a basic CSGHub local instance.

- If you wish to install CSGHub on Kubernetes, please refer to the [Helm Chart installation guide](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart).

### Roadmap

Discover the [roadmap](/docs/roadmap_en.md) outlining CSGHub's future direction.

### Relase Notes
Refer to [release notes](./docs/release_notes.md) for information on feature improvements.

### Meetings & Contributing

We warmly invite you to explore the [OpenCSG Community](https://github.com/OpenCSGs/community), where you'll find comprehensive guides on becoming a vital part of the project.

- The process for joining [community meetings]((https://github.com/OpenCSGs/community?tab=readme-ov-file#community-meeting)), where you can engage with fellow members and share your ideas.
- Refer to the [contribution guide](https://github.com/OpenCSGs/community/blob/main/guidelines/CONTRIBUTING_en.md) for strategies on how to contribute to the project.
- [Contact us](https://github.com/OpenCSGs/community?tab=readme-ov-file#questions-and-issues) for any questions or issues, ensuring you're always supported throughout your journey with OpenCSG.
- Consult the [development guide](/docs/setup_en.md) for setting up the development environment.
