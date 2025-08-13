# CSGHub: In-Depth Overview of Features and Architecture  

As Large Language Models (LLMs) become increasingly central to digital transformation, organizations face growing challenges in managing these sophisticated LLM assets. They often struggle with scattered tools, limited management options, and security concerns. CSGHub is an open-source platform designed to address these challenges, making LLM assets management straightforward and secure.  

## CSGHub Key Features  

- **Unified LLMs Management:**  
  - Full lifecycle management for models, datasets, and code  
  - Support for large file operations and web-based collaboration  
  - Integrated version control and asset tracking  

- **Extensible Development Framework:**  
  - Full support for HTTPS and SSH protocols  
  - Seamless integration with popular SDK (Gradio, Streamlit)  
  - Automated environment optimization for model deployment  
  - One-click inference and fine-tuning capabilities  

- **Advanced Model Capabilities and Optimization:**  
  - Keep track of all model versions automatically  
  - Built-in model format conversion and data processing utilities  
  - Support for various data format conversion (CSV, JSON, Parquet)  
  - Web-based data preview capabilities  

- **Space and Asset Management Assistant (Copilot):**  
  - Quickly build and showcase AI applications  
  - Flexible asset management through Copilot assistant  
  - Enterprise-ready on-premises deployment option  

- **Multi-Source Data Synchronization and Recommendation:**  
  - Integration with the OpenCSG community  
  - Support for synchronizing models and datasets in the community  
  - Scenario-based solution suggestions  

- **Enterprise-Level Security and Access Control:**  
  - Support for integration with enterprise user systems  
  - Asset visibility settings  
  - License tracking and validation  

- **On-Premises Deployment Solutions:**  
  - One-click on-premises deployment  
  - Cloud-independent operation  
  - Full control over data  

- **E2E Data Processing and Intelligent Annotation System:**  
  - Customizable data processing pipelines  
  - Speed up processing with parallel computing  
  - Collaborate on data annotation tasks  

- **Resilient High-Availability Architecture:**  
  - Support for high-availability architecture  
  - Support for load balancing and resource scheduling to ensure stability  
  - Support for disaster recovery to ensure business continuity  

## CSGHub Tech Design  

We have built CSGHub on proven technologies to make it both powerful and reliable:  

- CSGHub integrates Git server with Git LFS protocol and Object Storage Service to create a reliable storage system. This integration provides flexible access to development tools while maintaining comprehensive data management capabilities.  
- Built on a service-oriented architecture, CSGHub features a backend server (CSGHub Server) and web interface (CSGHub Portal) for seamless management. Users can quickly deploy services with Docker Compose or Kubernetes Helm Chart, while developers can extend functionality through the CSGHub Server for custom integrations and advanced features.  
- By leveraging Apache Arrow and DuckDB, CSGHub makes dataset management straightforward for both researchers and common users, offering convenient Parquet file preview functionality for local datasets.  
- The platform features a clean web interface with enterprise-ready permissions system. Users can easily manage version control, browse files online, configure access settings, and participate in discussions about models and datasets.  

Our R&D team focuses on AI + DevOps, aiming to address the challenges in LLM development through the CSGHub project. We welcome your contributions to enrich the documentation and strengthen the platform's capabilities.  

## CSGHub Architecture  

This repository contains the CSGHub Portal code, while CSGHub Server is developed as a separate high-performance backend project in Golang.  

To understand the details of CSGHub Server or learn how to integrate it with your own frontend system, check out the [CSGHub Server open-source project](https://github.com/OpenCSGs/csghub-server).  

### CSGHub Portal Architecture  

<img src="images/portal_tech_graph.png" width='800'>

### CSGHub Server Architecture  

<img src="images/server_tech_graph.png" width='800'>
