## CSGHub All-in-One Deployment Guide

This script enables the one-click deployment of an all-in-one CSGHub instance, including all related components:

* csghub-portal
* csghub-server
* nginx
* postgresql
* git-server
* minio
* casdoor
* account server
* user server
* space builder
* registry


**Notice:**
CSGHhub v0.4.0 supports the space function, and v0.7.0 supports model fine-tuning, inference. Space, model fine-tuning and inference all require Kubernetes and other related environments and configurations, since Kubernetes is not included here,  the All-in-one deployment here `does not include space, model fine-tuning and inference functions`.

### Prerequisites
* Hardware

Minimum Configuration: 2c CPU / 6GB RAM / 50GB Hard Disk

Recommended Configuration: 4c CPU / 16GB RAM / 500GB Hard Disk

* Software

Any Linux OS with x86_64 architecture

Docker Engine (>=5:20.10.24)

### Usage
1. Navigate to the `all_in_one` directory.
2. Edit the `.env` file and set `SERVER_DOMAIN` to the current host's IP address or domain name. DO NOT use `127.0.0.1` or `localhost`.
3. the space and registry related configurations in .env can be ignored without Kubernetes cluster.
3. Run the `startup.sh` script. Once all services are started, you can visit the self-deployed CSGHub service at `http://[SERVER_DOMAIN]`.

### Notes
1. Self-deployed CSGHub uses local-type Docker volumes for persistence, such as for PostgreSQL and Minio. Ensure that Docker local volumes have sufficient disk space.
1. Ensure that the external port `2222` of the host is accessible, as Git operations via the SSH protocol depend on it.
1. Make sure the host's external port 31001 is accessible, which is used by the casdoor service for user registration and login.
1. The Minio console can be visited through the port `9001`. If Minio console is not required, this port can be closed.
1. By default, only HTTP protocol is supported for CSGHub services. If HTTPS is required, configure it accordingly.
1. Do not arbitrarily modify or delete the `gitdata` and `gitlog` folders. These are runtime folders mounted into relevant container services, and the owner of these folders must be `1001`. Changing file owner or deleting these directories will result in startup errors.
1. Completely remove CSGHub instance with below command:
```
docker compose -f docker-compose.yml down -v
rm -rf gitdata gitlog
```