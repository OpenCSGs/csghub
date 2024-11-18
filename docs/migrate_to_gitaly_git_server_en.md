# Migrating to Gitaly

## Overview

As of Release v0.9.0, the Git server has been migrated from `Gitea` to `Gitaly`. A core component of GitLab, `Gitaly` moves Git operations out of the `GitLab` application and runs them on a dedicated server. This gRPC-based service delegates Git operations to the appropriate repos and supports multi-server deployments to ensure high availability and scalability. This guide will walk you through the steps to migrate your service from the `Gitea` to the `Gitaly`.

## Migration Instructions

### 1. Preparation

Before proceeding with the migration, ensure the following:

1. The repository storage directory for the Gitea is mounted and accessible.
2. The CSGHub service is temporarily disabled to prevent data loss during migration.

### 2. Steps to Migrate

1. Locate the repository storage directory for the Gitea version, e.g., `/data/gitdata/git/repositories`.
2. Update the Gitaly configuration file by locating the `[[storage]]` section and setting the `path` value to the directory obtained in Step 1.
3. Start all CSGHub services, then enter the `csghub-server` container and run `./starhub git generate-lfs-meta-objects`.

### 3. Confirming Migration Success

Log in to the updated service to verify that the repositories have migrated successfully and that all files within them are intact.
