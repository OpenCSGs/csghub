# Migration to Gitaly

## Introduction

In Release v0.9.0, we migrated the existing Git server from `Gitea` to `Gitaly`. `Gitaly` is a component of `GitLab` that offloads Git operations from the `GitLab` application and runs them on a separate server. `Gitaly` is a gRPC service that delegates Git operations to repositories. It can run across multiple servers to achieve high availability and scalability. After migrating to `Gitaly`, you will benefit from improved performance and greater scalability. This document will guide you through the process of migrating from the `Gitea`-based service to the `Gitaly`-based service.

## Migration Steps

### 1. Preparation

Before starting the migration, ensure the following:

1. The repository storage directory from the Gitea-based service is mounted and accessible.
2. The CSGHub service is no longer accepting any requests to avoid data loss during the migration process.

### 2. Migration Steps

1. Locate the repository storage directory from the Gitea-based service, for example: `/data/gitdata/git/repositories`.
2. Configure this directory in the Gitaly configuration file. In the Gitaly configuration, find the `[[storage]]` section and set the `path` value to the directory from Step 1.
3. Start all CSGHub services, then enter the `csghub-server` container and run `./starhub git generate-lfs-meta-objects`.

### 3. Verify Migration Results

Log in to the new service and verify whether the repositories have been successfully migrated and the files within the repositories are intact.
