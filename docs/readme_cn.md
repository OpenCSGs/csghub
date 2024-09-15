**[English](/docs/readme_en.md) ∙ [简体中文](/docs/readme_cn.md) ∙ [日本語](/docs/readme_ja.md)  ∙ [한국어](/docs/readme_kr.md)**

> [!WARNING]
CSGHub Portal 将 web 框架从 Rails 迁移到 Gin。如果你之前在使用我们的 Rails 版本，你可能需要参考我们的新文档[migrate to Gin](/docs/migrate_to_gin_version_portal_en.md)来了解如何迁移到Gin版本。

## CSGHub说明文档

CSGHub是一个开源、可信的大模型资产管理平台，可帮助用户治理LLM和LLM应用生命周期中涉及到的资产(数据集、模型文件、代码等)。基于CSGHub，用户可以通过Web界面、Git命令行或者自然语言Chatbot等方式，实现对模型文件、数据集、代码等资产的操作，包括上传、下载、存储、校验和分发；同时平台提供微服务子模块和标准化API，便于用户与自有系统集成。

CSGHub致力于为用户带来针对大模型原生设计的、可私有化部署离线运行的资产管理平台。CSGHub提供类似私有化的Huggingface功能，以类似OpenStack Glance管理虚拟机镜像、Harbor管理容器镜像以及Sonatype Nexus管理制品的方式，实现对LLM资产的管理。

您可以通过OpenCSG传神社区体验SaaS版功能：https://opencsg.com <br>也可以参照[快速使用](#快速使用)部分的说明文档，快速启动本地服务来探索CSGHub的所有功能。
<kbd>
<img src="/docs/images/project_intro.jpg" width='800'>
</kdb>
### 更新
- [2024.09.15] v0.9.0 CSGHub Portal 已经迁移到 Go 版本，git 服务器支持 Gitaly 并默认使用它，添加了集合功能，新的资源控制台页面，运行空间、推理和微调不再需要域其他用户体验优化和 bug 修复。
- [2024.08.15] v0.8.0 重大更新：用户、组织和 Token 管理从 `CSGHub` 项目迁移到后端服务 `CSGHub-server` 项目，独立出新的`user`服务。模型推理、微调和应用空间的部署和管理统一到新的服务`starhub_server_runner service`。资源管理增强，支持多 k8s 集群，支持跨地域.
- [2024.07.15] v0.7.0 重大更新：支持模型和数据集的**多源同步**、模型**一键微调**、计算资源使用**计量**。
- [2024.06.21] v0.6.1 修复了bug并增强了用户体验。
- [2024.06.18] v0.6.0 重大更新：支持专属模型推理部署，支持**streamlit**应用空间，允许用户**收藏**仓库以及设置仓库的**行业标签**，增强了git历史和提交差异详情。
- [2024.05.14] v0.5.0 增强了空间用户体验，**自动构**建仓库（模型、数据集、代码和空间）之间的**关联关系**，支持多文件上传。
- [2024.04.18] v0.4.0 允许运行**应用空间**（gradio应用），添加了一个试用模型推理的小部件，支持新的仓库类型**代码**，支持组织成员管理，支持微信登录。
- [2024.03.15] v0.3 Plan: 文件在线新建和编辑，组织信息编辑，数据集预览。
- [2024.02.15] v0.2 完善模型数据集的托管功能，新增了组织成员邀请功能。
- [2024.01.15] v0.1 CSGHub Alpha版本发布，支持模型和数据集管理功能，详细功能说明参见下文。

### 核心理念
在这个多元化的大模型时代，数据和模型逐渐成为企业和个人用户最重要的数字资产。然而，目前面临着管理工具分散、管理手段单一、单机化等问题，这不仅对安全运营构成潜在威胁，也可能阻碍企业大模型能力的更新迭代。若您认同大模型将成为信息革命的主要推动力，或许也在考虑如何更高效、更安全可靠地管理核心资产——模型、数据和大模型应用代码。CSGHub便是为解决这些问题而设计的开源项目。

CSGHub的功能特点如下（持续迭代中）：
- **资产统一管理**： 一站式Hub统一管理模型文件、数据集、大模型应用代码。
- **研发生态兼容**： 同时支持HTTPS和SSH协议的Git命令和Web界面操作， 确保不同用户均可方便使用。
- **大模型能力扩展**：原生支持版本化管理、模型格式转化、数据自动预处理、数据集预览等功能。
- **权限与安全**： 支持与企业用户系统集成、支持资产可见范围设置、外内部接口鉴权设计，满足企业安全需求。
- **私有化部署支持**： 无互联网依赖、无云厂商依赖等外部依赖，可一键启动私有化部署。
- **大模型原生设计**： 支持自然语言交互、模型一键部署、Agent与Copilot App等资产管理。

### 技术特点
CSGHub的技术特点如下：
- CSGHub整合了多源Git Server、Git LFS大文件存储协议和对象存储OSS等技术，提供可靠的数据存储层、灵活的基础设施接入层和高兼容的研发工具支持。
- 通过服务化的架构， CSGHub提供CSGHub Server后台服务和CSGHub Web Service的管理界面，普通用户可以快速使用Docker compose或Kubernetes Helm Chart启动服务，实现生产级的资产管理。具备自研能力的用户可利用CSGHub Server进行二次开发，将管理功能集成到外部系统或自定义高级功能。
- CSGHub借助Apache Arrow和DuckDB等优秀开源项目，支持Parquet数据文件格式的预览，便于算法研究人员和爱好者进行本地化数据集管理。
- CSGHub提供直观的Web界面和面向企业组织架构的权限设计，用户可通过Web UI实现版本控制管理、在线浏览和下载，也可以设置数据集和模型文件的可见范围，实现数据安全隔离，还可以对模型和数据集发起话题讨论。

OpenCSG团队专注于大模型领域，希望通过CSGHub项目解决大模型开发过程中的痛点。我们鼓励大家贡献高质量的开发和运维文档，共同改进这个平台，让大模型的管理"有据可循"。

### 演示视频
为了帮助您更直观地了解 CSGHub 的功能和使用方法，我们录制了演示视频。您可以通过观看视频，快速了解本项目的主要特性和操作流程。
- CSGHub功能演示如下，你也可以通过外部视频网站查看 [YouTube](https://www.youtube.com/watch?v=SFDISpqowXs) 或 [Bilibili](https://www.bilibili.com/video/BV1wk4y1X7G7/)
<video width="658" height="432" src="https://github-production-user-asset-6210df.s3.amazonaws.com/3232817/296556812-205d07f2-de9d-4a7f-b3f5-83514a71453e.mp4"></video>

### 近期路线图
- **资产管理**
  - [x] 内置代码仓库：内置代码Repo管理功能，可关联模型、数据集、Space空间应用的代码。
  - [x] 多源数据同步: 支持配置并启用远端仓库, 自动数据同步，支持OpenCSG传神社区、Huggingface等远端源。
- **AI能力增强**
  - [x] 一键微调: 支持与OpenCSG llm-finetune集成，一键启动模型微调训练。
  - [x] 一键推理: 支持与OpenCSG llm-inference集成，一键启动模型推理服务。
- **应用与企业功能**
  - [x] 应用空间: 支持托管Gradio/Streamlit应用并发布到Space应用空间
  - [x] 细粒度权限控制：面向企业架构的细粒度权限和访问控制设置
- **安全合规**
  - [ ] GitServer适配器: 通用GitServer适配器，通过Adaptor模式实现对多种主流Git仓库后端的支持。
  - [x] 资产元数据: 资产元数据管理机制， 支持自定义元数据类型和对应的AutoTag规则。

详细路线图设计请参见：[完整路线图](/docs/roadmap.md)

### 详细架构
CSGHub由Portal和Server两部分服务组成，本项目代码部分对应CSGHub Portal，而CSGHub Server则是由golang实现的一个高性能后端。

如果您想深入了解CSGHub Server或者想集成Server到自己的前端系统或进行二次开发，可以查看[CSGHub Server开源项目](https://github.com/OpenCSGs/csghub-server)。
#### CSGHub Portal 架构图
<img src="/docs/images/portal_tech_graph.png" width='800'>

#### CSGHub Server 架构图
<img src="/docs/images/server_tech_graph.png" width='800'>

### 快速使用
请参考[部署帮助文档](/deploy/all_in_one/README.md)部署一个基本功能的VSGHub实例.

### 详细技术文档
- [开发环境搭建](/docs/setup.md)

### 贡献指南
我们欢迎各种级别的开发者为我们的开源项目 CSGHub 做出贡献。如果您想要参与贡献，请查阅我们的[贡献指南](/CONTRIBUTING.md)，我们期待您的参与和建议。

### 致谢
本项目基于 Rails、Vue3、Tailwind CSS、Administrate、Postgresql、Apache Arrow、DuckDB 和 GoGin，在此深深感谢他们的开源贡献！

### 联系我们
使用过程中的任何问题， 您可以通过以下任何一种方式联系我们：
1. 在github 发起issue
2. 扫描下方左侧微信二维码，添加微信小助手回复"开源"或者"open source"入群，加入我们的微信讨论群
3. 加入我们的Discord频道: [OpenCSG Discord Channel](https://discord.gg/bXnu4C9BkR)
4. 加入我们的Slack频道: [OpenCSG Slack Channel](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
<div style="display:inline-block">
<img src="/docs/images/wechat-assistant-new.png" width='200'>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/discord-qrcode.png" width='200'>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/slack-qrcode.png" width='200'>
</div>
