# Migrating to Gin

To start, let's assume you have a Rails version of the CSGHub Portal already deployed.

## Pull the Latest Code for the Gin Version

```bash
git fetch origin
git reset --hard origin/main
```

By doing this, you will use the remote latest main branch to overwrite your local main branch. You also fetch the 'rails-main' branch to local in which you can see the old Rails version code.

This command resets your local `main` branch to match the remote `main` branch. Additionally, it pulls a branch called `rails-main` that contains the old Rails version code.

## Deploying the Gin Server

Refer to [this document](https://github.com/OpenCSGs/csghub/blob/main/docs/setup_en.md) to deploy your Gin server. By default, Gin runs on port `8090`.

### DB Config

You can setup the database URL through the ENV variable `CSGHUB_PORTAL_DATABASE_DSN`. It's possible to use the same database as the Rails version since compatibility has already been addressed.

Note that the default database URL is:  
`postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable`  
This may differ from the database name used by your Rails server, you may need to update the URL for local use.
