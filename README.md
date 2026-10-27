# 👤 User Service

A Node.js microservice for user registration and login. Firebase Authentication owns credentials;
PostgreSQL stores the user profile. If Firebase rejects a new user, the profile row is rolled back so the
two stores never drift apart.

![CI](https://github.com/Ficabral10/User-service/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?logo=firebase&logoColor=black)

## Architecture

```
client ──► Express ──► validator middleware ──► UserController ──┬──► Firebase Auth  (email + password)
                         (fastest-validator)                     └──► PostgreSQL     (profile, via Sequelize)
```

- **Passwords never touch the database.** Only Firebase sees them; Postgres holds name and email.
- **Request validation** runs before any handler: malformed emails, empty names or passwords under
  6 characters get a `422` with the list of problems.
- **Consistent errors:** `409` for a duplicate email, `401` for bad credentials, `{ "error": "<code>" }` bodies.

## API

| Method | Path | Body | Success |
|---|---|---|---|
| `GET` | `/health` | | `200 { "status": "ok" }` |
| `POST` | `/users` | `firstName`, `lastName`, `email`, `password` | `201` created profile |
| `POST` | `/users/login` | `email`, `password` | `200 { "uid", "profile" }` |

```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ana","lastName":"Silva","email":"ana@example.com","password":"secret123"}'
```

## Run it

```bash
git clone https://github.com/Ficabral10/User-service.git
cd User-service
npm install

cp .env.example .env        # add your Firebase web app config
docker compose up -d        # local PostgreSQL on :5432
npm run migrate             # create the Users table
npm run dev                 # http://localhost:3002
```

## Tests

```bash
npm test
```

Jest + Supertest cover the endpoints, validation, the duplicate/credential error paths and the Firebase
rollback. Firebase and the database are mocked, so tests run without either. They run on every push in
GitHub Actions.

## Project structure

```
server.js                         Express app and routes
src/routes/users/                 /users routes
src/middleware/users/             request validation
src/controllers/users/            registration and login logic
src/models/userModel.js           Sequelize User model
src/services/firebase.js          Firebase app (config from env)
migrations/                       sequelize-cli migrations
config/                           database connection and sequelize-cli config
tests/                            Jest + Supertest suite
```

## Next steps

- Verify Firebase ID tokens (Admin SDK) on protected routes instead of signing in server-side
- Profile update and delete endpoints
- OpenAPI spec and Swagger UI

## License

[MIT](LICENSE)
