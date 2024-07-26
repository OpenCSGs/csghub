**[简体中文](/docs/readme_cn.md) ∙ [English](/docs/readme_en.md)**
## CSGHub README

CSGHub is an open source, trustworthy large model asset management platform that can assist users in governing the assets involved in the lifecycle of LLM and LLM applications (datasets, model files, codes, etc).

With CSGHub, users can perform operations on LLM assets, including uploading, downloading, storing, verifying, and distributing, through Web interface, Git command line, or natural language Chatbot. Meanwhile, the platform provides microservice submodules and standardized OpenAPIs, which could be easily integrated with users' own systems.

CSGHub is committed to bringing users an asset management platform that is natively designed for large models and can be deployed On-Premise for fully offline operation. CSGHub offers functionalities similar to a privatized Huggingface(on-premise Huggingface), managing LLM assets in a manner akin to how OpenStack Glance manages virtual machine images, Harbor manages container images, and Sonatype Nexus manages artifacts.

You can try the free SaaS version of CSGHub through the OpenCSG Community official website.https://opencsg.com<br>You can also jump to the [Quick Start](#quick-start) section to quickly launch your local instance and explore all the features of CSGHub.
<kbd>
<img src="/docs/images/project_intro.jpg" width='800' />
</kdb>
### UPDATES
- [2024.07.15] v0.7.0 Big release to support `Multiple Resource Sync` for models and datasets, One-Click Fintune, Resource Usage Metering.
- [2024.06.21] v0.6.1 bug fix and user experience enhancement. 
- [2024.06.18] v0.6.0 Big release to support `dedicated` model inference endpoint, support `streamlit` Space, allow use to `like` repos allow to set repo's `industry tag`, enhance git history and commit diff details.
- [2024.05.14] v0.5.0 Enhance Space user experience, auto build `relations` between repos(model,dataset,code and spaces), support multiple files uploading. 
- [2024.04.18] v0.4.0 Allow to run `Application Space` (gradio app), add a widget to try model inference, support new repo type `Code`, support organization members management, support wechat login.
- [2024.03.15] v0.3.0 Plan: Files online editing, organization edit, dataset preview.
- [2024.02.15] v0.2.0 Improve the function of model dataset hosting, and add the feature of inviting new organization members.
- [2024.01.15] v0.1.0 CSGHub Alpha version release, supports model and dataset management functions, detailed function is as below.

### CORE FUNCTIONS
In the era of LLM, data and models are increasingly becoming the most important digital assets for businesses and individual users. However, there are currently issues such as fragmented management tools, limited management methods, and localization, which not only pose potential threats to secure operations but also might hinder the updating and iteration of enterprise-scale models. If you believe that large models will become a major driving force in the upcoming revolution, you may also be considering how to manage core assets — models, data, and large model application code — more efficiently and securely. CSGHub is an open-source project designed to address these issues.

CSGHub's core funtions（update reguarly）：
- **Unified Management of LLM Assets**: A one-stop Hub for unified management of model files, datasets, and large-scale model application codes.
- **Development Ecosystem Compatibility**: Supports both HTTPS and SSH protocols for Git commands and web interface operations, ensuring convenient usage for different users.
- **Large Model Capability Expansion**: Natively supports version management, model format conversion, automatic data processing, and dataset preview functions.
- **Permissions and Security**: Supports integration with corporate user systems, setting of asset visibility, and zero-trust authentication interface design for both external and internal users, maximizing security.
- **Support for Private Deployment**: Independent of internet and cloud vendors, enabling one-click initiation of private deployment.
- **Native Design for Large Models**: Supports natural language interaction, one-click model deployment, and asset management for Agent and Copilot App.

### TECH DESIGN
The technical design of CSGHub are as follows:
- CSGHub integrates multiple technologies including Git Servers, Git LFS (Large File Storage) protocol, and Object Storage Service (OSS), providing a reliable data storage layer, a flexible infrastructure access layer, and extensive support for development tools.
- Utilizing a service-oriented architecture, CSGHub offers backend services through CSGHub Server and a management interface via CSGHub Web Service. Ordinary users can quickly initiate services using Docker compose or Kubernetes Helm Chart for enterprise-level asset management. Users with in-house development capabilities can utilize CSGHub Server for secondary development to integrate management functions into external systems or to customize advanced features.
- Leveraging outstanding open-source projects like Apache Arrow and DuckDB, CSGHub supports previewing of Parquet data file formats, facilitating localized dataset management for researchers and common users.
- CSGHub provides an intuitive web interface and permission design for enterprise organization structure. Users can realize version control management, online browsing and downloading through the web UI, as well as set the visibility scope of datasets and model files to realize data security isolation, and can also initiate topic discussions on models and datasets.

Our R&D team has been focusing on AI + DevOps for a long time, and we hope to solve the pain points in the development process of large models through the CSGHub project. We encourage everyone to contribute high-quality development and operation and maintenance documents, and work together to improve the platform, so that large models assets can be more traceable and efficient.

### DEMO VIDEO
In order to help users to quickly understand the features and usage of CSGHub, we have recorded a demo video. You can watch this video to get a quick understanding of the main features and operation procedures of this program.
- CSGHub Demo video is as below，you can also check it at [YouTube](https://www.youtube.com/watch?v=SFDISpqowXs) or [Bilibili](https://www.bilibili.com/video/BV1wk4y1X7G7/)
<video width="658" height="432" src="https://github-production-user-asset-6210df.s3.amazonaws.com/3232817/296556812-205d07f2-de9d-4a7f-b3f5-83514a71453e.mp4"></video>

### ROADMAP
- **Asset Management**
  - [x] Built-in Code Repo: Built-in Code Repo management function to associate the code of model, dataset, Space space application.
  - [x] Multi-source data synchronization: Support configure and enable remote repository, automatic data synchronization, support OpenCSG community, Huggingface and other remote sources。
- **AI Enhancement**
  - [x] One-Click Fine-Tuning: Support integration with OpenCSG llm-finetune tool to start model fine-tuning training with one click.
  - [x] One-Click Inference: Support integration with OpenCSG llm-inference tool to start model reasoning service with one click.
- **LLM App and Enterprise Features**
  - [x] App Space: Support hosting Gradio/Streamlit applications and publishing them to App Space.
  - [x] Fine-grained Permission Control: Fine-grained permission and access control settings for enterprise architecture.
- **Security Compliance**
  - [ ] GitServer Adapter: Generic GitServer adapter to support multiple major Git repository types through Adaptor mode.
  - [x] Asset Metadata: Asset metadata management mechanism, supporting customized metadata types and corresponding AutoTag rules.

The detailed roadmap is designed as follows: [full roadmap](/docs/roadmap_en.md)

### ARCHITECTURE
CSGHub is made with two typical parts: Portal and Server. This repo corresponds to CSGHub Portal, while CSGHub Server is another high-performance backend project implemented with Golang.

If you want to dive deep into CSGHub Server detail or wish to integrate the Server with your own frontend system or more, you can check the [CSGHub Server open-source project](https://github.com/OpenCSGs/csghub-server).

#### CSGHub Portal Architecture
<img src="/docs/images/portal_tech_graph.png" width='800'>

#### CSGHub Server Architecture
<img src="/docs/images/server_tech_graph.png" width='800'>

### QUICK START
You can quickly deploy a CSGHub instance with portal/server and all other relevant dependencies to your environment using the following commands:
```shell
# please replace [IP Address] with your own LAN/WLAN ip address
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one.yml -o all-in-one.yml
docker compose -f all-in-one.yml up -d
```

if you are in China or you meet dockerhub network connection issue, you can try our aliyun docker registry alternative version with below:
```shell
# please replace [IP Address] with your own LAN/WLAN ip address
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```

or if you still meet Github network connection issue, you can try this one:
```shell
# please replace [IP Address] with your own LAN/WLAN ip address
export SERVER_DOMAIN=[IP Address]
curl -L https://opencsg-public-resource.oss-cn-beijing.aliyuncs.com/csghub/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```

Then, you could visit `http://[IP Address]` with your web browser to access this new CSHub instance; you could try all feature with your
inital admin account: admin001/admin001
You can check our website for more user guide information: [User Guide](https://opencsg.com/docs/) 

**Note:**

* `SERVER_DOMAIN` ([IP Address]) should be the IP address or domain name of the target host. Please avoid using `127.0.0.1` or `localhost`.
* Released container images are for the x86_64 architecture only and have been tested on Linux/Windows and Mac environments. For Mac Silicon user, it is necessary to enable the [Rosetta for x86/AMD64 emulation Feature](https://docs.docker.com/desktop/settings/mac/#general) in your Docker Desktop.
* **WARNING: This quick start is only for trial testing and does not support production-level deployment.** The CSGHub instance that deployed with this all-in-one script do not effectively persist user data: When using the `docker compose up` command to reload the service, errors may occur. In this case, you can use the `docker compose down -v` to completely remove the instance before relaunch it. Please always  follow the [Step-by-Step Deployment Guide](/script/all_in_one/README.md) for regular service deployment.
* **WARNING: The quick start does not include space application's deployment.** Starting from CSGHhub v0.4.0, the space function is supported. Since it still requires addtional Kubernetes and other services, please refer [Full Deployment Guide](/docs/full_deployment_en.md).

#### Tech docs in detail
- [setup development env](/docs/setup_en.md)

### Contributing
We welcome developers of all levels to contribute to our open-source project, CSGHub. If you would like to get involved, please refer to our [contributing guidelines](/docs/CONTRIBUTING_en.md). We look forward to your participation and suggestions.

### ACKNOWLEDGEMENTS
This project is based on Rails, Vue3, Tailwind CSS, Administrate, Postgresql, Apache Arrow, DuckDB and GoGin, whose open source contributions are deeply appreciated!

### CONTACT WITH US
If you meet any problem during usage, you can contact with us by any following way:
1. initiate an issue in github
2. join our WeChat group by scaning wechat helper qrcode
3. join our official discord channel: [OpenCSG Discord Channel](https://discord.gg/bXnu4C9BkR)
4. join our slack workspace:[OpenCSG Slack Channel](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
<div style="display:inline-block">
<img src="/docs/images/wechat-assistant-new.png" width='200'>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/discord-qrcode.png" width='200'>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/slack-qrcode.png" width='200'>
</div>
