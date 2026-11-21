# Frontend API handoff

Base URL in local development: `http://localhost:3000`

Send JSON bodies with `Content-Type: application/json`.

The access token is a JWT. Send it on protected requests as:

```http
Authorization: Bearer <accessToken>
```

`expiresIn` is how many seconds that access token remains valid (15 minutes, so `900`). The refresh token is an opaque string. It is valid for 30 days, or until it is used. Each refresh deletes the token you sent and returns a new one. Store the new `refreshToken` and discard the old one.

## POST /auth/sign-up

Creates an account and signs the user in. `201 Created`.

```json
{
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "password": "Password1!"
}
```

Rules:

- `email` must be a valid email address.
- `name` is trimmed. It must be 3 to 100 characters.
- `password` must be 8 to 128 characters and contain at least one letter, one number, and one special character.

```json
{
  "user": {
    "id": "6740c3a1e8b9f1a2b3c4d5e6",
    "email": "ada@example.com",
    "name": "Ada Lovelace",
    "createdAt": "2026-11-21T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
  "expiresIn": 900,
  "refreshToken": "k7Hq2pV0mR4sT8uW1xY3zA6bC9dE0fG2hI5jK8lM1nO"
}
```

`409 Conflict` when the email is already registered:

```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

`400 Bad Request` when the body is invalid:

```json
{
  "statusCode": 400,
  "message": [
    "name: Too small: expected string to have >=3 characters",
    "password: Password must contain at least one special character"
  ],
  "error": "Bad Request"
}
```

## POST /auth/sign-in

Signs an existing user in. `200 OK`.

```json
{
  "email": "ada@example.com",
  "password": "Password1!"
}
```

`password` only has to be 1 to 128 characters here. A password that was valid when the account was created still signs in.

The success body has the same shape as sign-up.

`401 Unauthorized` when the email or password is wrong. Both cases use the same body:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

## POST /auth/token/refresh

Exchanges a refresh token for a new access token and a new refresh token. `200 OK`.

```json
{
  "refreshToken": "k7Hq2pV0mR4sT8uW1xY3zA6bC9dE0fG2hI5jK8lM1nO"
}
```

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
  "expiresIn": 900,
  "refreshToken": "p9Lm3qW1nS5tU9vX2yZ4aB7cD0eF1gH3iJ6kL9mN2oP"
}
```

`401 Unauthorized` when the refresh token is missing from the database or its expiry has passed:

```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

## GET /me

Returns the signed-in user. Requires the access token. `200 OK`.

```json
{
  "id": "6740c3a1e8b9f1a2b3c4d5e6",
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "createdAt": "2026-11-21T00:00:00.000Z"
}
```

`401 Unauthorized` when the header is missing:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "errorCode": "missing_credentials"
}
```

An expired or otherwise invalid access token is also `401`. Call `POST /auth/token/refresh`, then retry with the new access token.
