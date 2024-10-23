
[![加入微信 Slack](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)
[![加入 OpenCSG Slack](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
[![加入 OpenCSG Discord](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)

**[English](README.md) ∙ [日本語](README_jp.md) ∙ [한국어](README_kr.md)**

## CSGHub

CSGHub 是一个开源平台，专为管理大语言模型（LLM）资产而设计，提供了高效管理 LLM 及其资产（如数据集、应用空间、代码等）的方式。用户可以通过网页界面、`git` 命令行、自然语言聊天机器人，或 [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk) 对 LLM 资产进行上传、下载、存储、校验和分发。

此外，CSGHub 提供微服务子模块和标准化 OpenAPI，以便与现有系统无缝集成。CSGHub 为大模型提供了友好的管理平台，并支持本地化部署，确保安全、离线运行。实际上，CSGHub 可以看作是 Huggingface 的私有化本地版本。

![CSGHub](./docs/images/csghub_framework.png)

### 核心功能

- **统一管理大模型资产**：一站式管理模型文件、数据集和大模型应用代码。
- **开发生态系统兼容性**：支持 HTTPS 和 SSH 协议，方便用户通过 Git 命令或网页界面进行操作。
- **大模型能力扩展**：支持版本管理、模型格式转换、自动数据处理和数据集预览功能。
- **权限与安全**：支持与企业用户系统集成、支持资产可见范围设置、外内部接口鉴权设计，满足企业安全需求。
- **支持私有化部署**：无需依赖互联网和云厂商，一键启动私有部署。
- **面向大模型的原生设计**：支持自然语言交互、一键模型部署，以及 Agent 与 Copilot App 等资产管理。

详细信息请参见 [CSGHub 详细介绍](./docs/detailed_intro_en.md)。

### 快速开始

- **想要快速探索的用户**：可在 [OpenCSG 网站](https://opencsg.com/models)上体验 CSGHub 的免费 SaaS 版本。参考该[快速开始指南](./docs/csghub_saas_zh.md)，通过 CSGHub SaaS 界面管理大模型和数据集，部署大模型应用。
更多信息与高级教程请参阅 [OpenCSG 文档中心](https://opencsg.com/docs/intro)。
 
- **想要进一步实践的用户**：请参考[安装指南](https://github.com/OpenCSGs/csghub-installer/tree/main/docker-compose/csghub)快速部署 CSGHub 的本地实例。

- **需要在 Kubernetes 上部署的用户**：请参考 [Helm Chart 安装指南](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart)进行部署。

### 路线图

了解 CSGHub 的未来规划，请查看[路线图](./docs/roadmap.md)。

### 版本公告

有关功能改进的信息，请参考[版本公告](./docs/release_notes_zh.md)。

### 会议与贡献

我们诚邀您一起探索 [OpenCSG 社区](https://github.com/OpenCSGs/community)，在这里您将找到详细的社区指南，欢迎您成为社区的贡献者分享您的内容。

- 了解如何加入[社区会议](https://github.com/OpenCSGs/community?tab=readme-ov-file#community-meeting)，与其他成员互动并分享您的想法。
- 请参阅[贡献指南](https://github.com/OpenCSGs/community/blob/main/guidelines/CONTRIBUTING_en.md)以了解如何为项目做出贡献。
- 如果有任何疑问或问题，请[联系我们](https://github.com/OpenCSGs/community?tab=readme-ov-file#questions-and-issues)以获得支持。
- 请参考[开发指南](./docs/setup.md)设置开发环境。
