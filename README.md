# Viking Survey Document Generator Backend

This is the backend for the survey document generator being developed within the Cape Ann Zenica team.

## Installation
### Part 1

Clone  the repocsitory.

Change directory into the repository

Use the node package manager [npm](https://www.npmjs.com/package/npm) to install the required dependencies.

```bash
npm install
```
### Part 2
## Postgres dagtabase

The server works with the postgresql database so you make sure you have it installed.

You can look it up [here](https://www.postgresql.org/docs/current/tutorial-install.html)

### Part 3
## Necessary .env changes

```javascript
//.env

// replace the user,port, password and host with the ones apropriate for your system
DATABASE_URL="postgresql://user:pass@localhost:port/viking?schema=public"

//replace the secret with your own
JWT_SECRET="secret"

//replace the stripe key with the one you can see on your stripe developer dashboard
STRIPE_SECRET_KEY="stripekey"

```
### Part 4
## Executing migrations

While in the repository directory, execute the prisma migration command
```bash
npx prisma migrate dev
```

# Starting the application
After executing the required steps you can start the application from the root directory by running the npm start command.
```
npm start
```
