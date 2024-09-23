## CSGHub Core Functions
In the era of LLM, data and models are increasingly becoming the most important digital assets for businesses and individual users. However, there are currently issues such as fragmented management tools, limited management methods, and localization, which not only pose potential threats to secure operations but also might hinder the updating and iteration of enterprise-scale models. If you believe that large models will become a major driving force in the upcoming revolution, you may also be considering how to manage core assets — models, data, and large model application code — more efficiently and securely. `CSGHub` is an open-source project designed to address these issues.

`CSGHub`'s core funtions（update reguarly）：
- **Unified Management of LLM Assets**: A one-stop Hub for unified management of model files, datasets, and large-scale model application codes.
- **Development Ecosystem Compatibility**: Supports both HTTPS and SSH protocols for Git commands and web interface operations, ensuring convenient usage for different users.
- **Large Model Capability Expansion**: Natively supports version management, model format conversion, automatic data processing, and dataset preview functions.
- **Permissions and Security**: Supports integration with corporate user systems, setting of asset visibility, and zero-trust authentication interface design for both external and internal users, maximizing security.
- **Support for Private Deployment**: Independent of internet and cloud vendors, enabling one-click initiation of private deployment.
- **Native Design for Large Models**: Supports natural language interaction, one-click model deployment, and asset management for Agent and Copilot App.

### CSGHub Tech Design
The technical design of `CSGHub` are as follows:
- `CSGHub` integrates multiple technologies including Git Servers, Git LFS (Large File Storage) protocol, and Object Storage Service (OSS), providing a reliable data storage layer, a flexible infrastructure access layer, and extensive support for development tools.
- Utilizing a service-oriented architecture, `CSGHub` offers backend services through `CSGHub` Server and a management interface via `CSGHub` Web Service. Ordinary users can quickly initiate services using Docker compose or Kubernetes Helm Chart for enterprise-level asset management. Users with in-house development capabilities can utilize `CSGHub` Server for secondary development to integrate management functions into external systems or to customize advanced features.
- Leveraging outstanding open-source projects like Apache Arrow and DuckDB, `CSGHub` supports previewing of Parquet data file formats, facilitating localized dataset management for researchers and common users.
- `CSGHub` provides an intuitive web interface and permission design for enterprise organization structure. Users can realize version control management, online browsing and downloading through the web UI, as well as set the visibility scope of datasets and model files to realize data security isolation, and can also initiate topic discussions on models and datasets.

Our R&D team has been focusing on AI + DevOps for a long time, and we hope to solve the pain points in the development process of large models through the `CSGHub` project. We encourage everyone to contribute high-quality development and operation and maintenance documents, and work together to improve the platform, so that large models assets can be more traceable and efficient.

### CSGHub Demo Video
In order to help users to quickly understand the features and usage of `CSGHub`, we have recorded a demo video. You can watch this video to get a quick understanding of the main features and operation procedures of this program.
- `CSGHub` Demo video is as below，you can also check it at [YouTube](https://www.youtube.com/watch?v=SFDISpqowXs) or [Bilibili](https://www.bilibili.com/video/BV1wk4y1X7G7/)
<video width="658" height="432" src="https://github-production-user-asset-6210df.s3.amazonaws.com/3232817/296556812-205d07f2-de9d-4a7f-b3f5-83514a71453e.mp4"></video>

### Architecture
`CSGHub` is made with two typical parts: Portal and Server. This repo corresponds to `CSGHub` Portal, while `CSGHub` Server is another high-performance backend project implemented with Golang.

If you want to dive deep into `CSGHub` Server detail or wish to integrate the Server with your own frontend system or more, you can check the [`CSGHub` Server open-source project](https://github.com/OpenCSGs/`CSGHub`-server).

#### CSGHub Portal Architecture
<img src="/docs/images/portal_tech_graph.png" width='800'>

#### CSGHub Server Architecture
<img src="/docs/images/server_tech_graph.png" width='800'>
