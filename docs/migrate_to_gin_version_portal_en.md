# Migrate to Gin

Let's assume that you already have a Rails version Portal deployed before.

## Pull the latest repo with Gin version as default

```bash
git fetch origin
git reset --hard origin/main
```

By doing this, you will use the remote latest main branch to overwrite your local main branch. You also fetch the 'rails-main' branch to local in which you can see the old Rails version code.

## Deploy your Gin server
Please refer to [Setup](setup_en.md) to deploy your Gin server. Yes, you should deloy a new server by default Gin will use 8090 port.

### DB config
You can setup the DB url by ENV variable: CSGHUB_PORTAL_DATABASE_DSN. And you can use the same database used by your Rails server, as we have completed the compatibility considerations.

One thing to note is the default database URL which is: "postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable" which may have a different database name to your Rails server, you may need to update it which running it locally.