**[English](/docs/readme_en.md) ∙ [简体中文](/docs/readme_cn.md)**
## CSGHub说明文档

CSGHub是一个开源、可信的大模型资产管理平台，可帮助用户治理LLM和LLM应用生命周期中涉及到的资产(数据集、模型文件、代码等)。基于CSGHub，用户可以通过Web界面、Git命令行或者自然语言Chatbot等方式，实现对模型文件、数据集、代码等资产的操作，包括上传、下载、存储、校验和分发；同时平台提供微服务子模块和标准化API，便于用户与自有系统集成。

CSGHub致力于为用户带来针对大模型原生设计的、可私有化部署离线运行的资产管理平台。CSGHub提供类似私有化的Huggingface功能，以类似OpenStack Glance管理虚拟机镜像、Harbor管理容器镜像以及Sonatype Nexus管理制品的方式，实现对LLM资产的管理。

您可以通过OpenCSG传神社区体验SaaS版功能：https://opencsg.com <br>也可以参照[快速使用](#快速使用)部分的说明文档，快速启动本地服务来探索CSGHub的所有功能。
<kbd>
<img src="/docs/images/project_intro.jpg" width='800'>
</kdb>
### 更新
- [2024.02.15] v0.3 Plan: 文件在线新建和编辑，组织信息编辑，数据集预览。
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
【适合高速访问github和dockerhub用户】可使用如下命令快速部署一个CSBHub实例（包含Portal、Server和完整的其他依赖组件）到本地环境。
```shell
# 请将[IP Address]替换为您的内网IP地址
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one.yml -o all-in-one.yml
docker compose -f all-in-one.yml up -d
```

【适合访问dockerhub慢/异常的用户】中国国内用户可选择使用阿里云容器镜像版本的部署脚本，以加快镜像下载和服务启动，完整命令如下：
```shell
# 请将[IP Address]替换为您的内网IP地址
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```
【适合访问github和dockerhub慢/异常的用户】如果遇到Github网络连接和下载问题，你可以选择从阿里云对象存储中下载一键部署脚本：
```shell
# 请将[IP Address]替换为您的内网IP地址
export SERVER_DOMAIN=[IP Address]
curl -L https://opencsg-public-resource.oss-cn-beijing.aliyuncs.com/csghub/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```

部署完毕后，就可以在浏览器上通过`http://[IP Address]`访问到新部署的CSGHub实例；
实例启动后，您可以使用初始管理员账号：admin001/admin001，详细用户文档可参看[使用文档](https://opencsg.com/docs/)

**快速安装注意事项：**
* `SERVER_DOMAIN` ([IP Address])为目标主机的IP地址或者域名，请不要使用`127.0.0.1`或者`localhost`。
* 当前发布的服务镜像仅支持x86_64架构，已测试Linux/Windows和Mac环境，Mac Silicon架构环境需要开启Docker Desktop的[Rosetta for x86/AMD64 emulation](https://docs.docker.com/desktop/settings/mac/#general)。
* **请注意：快速安装仅适用于试用测试，不能支持服务级部署。** 使用该all-in-one脚本启动过的实例无法有效持久化用户数据。服务启动后，使用`docker compose up`命令重新加载服务会出现错误，此时可以选择使用`docker compose down -v`命令彻底清除实例再重新启动。请务必参照[完整一键部署指南](/script/all_in_one/README.md)进行服务部署。
* **请注意：快速安装不包含space部署相关功能。** 从CSGHhub v0.4.0开始支持了space功能，由于space的构建部署需要Kubernetes以及其他相关环境和配置，请参考该[完整部署文档](/docs/full_deployment_cn.md)进行完全版功能部署。

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
