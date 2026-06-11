# API Documentation

Base URL: `http://localhost:8000`
Live version: `http://145.24.237.81:8000`

All request bodies use `application/json` unless the route accepts a file upload, in which case use `multipart/form-data`.

NOTICE
There are two ways of creating a user, via user and via auth, when creating the frontend, please use the auth route
---

## Users `/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a single user |
| GET | `/users/:id/profile` | Get user with favorites, likes and events populated |
| GET | `/users/:id/favorites` | Get a user's favorited pieces (populated) |
| POST | `/users` | Create a user |
| POST | `/users/:id/favorites/:pieceId` | Add a piece to favorites |
| POST | `/users/:id/likes/:pieceId` | Like a piece |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |
| DELETE | `/users/:id/favorites/:pieceId` | Remove a piece from favorites |
| DELETE | `/users/:id/likes/:pieceId` | Unlike a piece |

### POST `/users` — Create a user
`multipart/form-data`
```
username    string    required
email       string    required
password    string    required
premium     boolean
avatar      file      image (jpeg, png, gif, webp) max 5MB
```

### PUT `/users/:id` — Update a user
`multipart/form-data`
```
username    string
email       string
password    string
premium     boolean
avatar      file      image (jpeg, png, gif, webp) max 5MB
```

### POST `/users/:id/favorites/:pieceId`
No body needed — IDs are in the URL.

### POST `/users/:id/likes/:pieceId`
No body needed — IDs are in the URL.

---

## Pieces `/pieces`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pieces` | Get all pieces |
| GET | `/pieces/:id` | Get a single piece (user, wall, style populated) |
| GET | `/pieces/wall/:wallId` | Get all pieces on a specific wall |
| GET | `/pieces/user/:userId` | Get all pieces by a specific user |
| POST | `/pieces` | Create a piece |
| PUT | `/pieces/:id` | Update a piece |
| DELETE | `/pieces/:id` | Delete a piece |

### POST `/pieces` — Create a piece
`multipart/form-data`
```
user            string    required  (_id of user)
wall            string    required  (_id of wall)
graffitiStyle   string    required  (_id of graffiti style)
title           string    required
description     string    required
date            string    required  (YYYY-MM-DD)
image           file      image (jpeg, png, gif, webp) max 5MB
```

### PUT `/pieces/:id` — Update a piece
`multipart/form-data`
```
user            string
wall            string
graffitiStyle   string
title           string
description     string
date            string
image           file      image (jpeg, png, gif, webp) max 5MB
```

---

## Walls `/walls`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/walls` | Get all walls |
| GET | `/walls/:id` | Get a single wall (location populated) |
| GET | `/walls/filter/legal` | Get all legal walls |
| GET | `/walls/city/:cityName` | Get all walls in a city |
| POST | `/walls` | Create a wall |
| PUT | `/walls/:id` | Update a wall |
| DELETE | `/walls/:id` | Delete a wall |

### POST `/walls` — Create a wall
`application/json`
```json
{
  "location":    "<location_id>",
  "coordinates": "51.9225,4.47917",
  "description": "Big wall near the station",
  "regionName":  "South Holland",
  "cityName":    "Rotterdam",
  "isLegal":     true,
  "hasRoute":    false
}
```

### PUT `/walls/:id` — Update a wall
`application/json` — any of the fields above.

---

## Events `/events`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events |
| GET | `/events/:id` | Get a single event (host and participants populated) |
| POST | `/events` | Create an event |
| POST | `/events/:id/join/:userId` | User joins an event |
| PUT | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event (cleans up user references) |
| DELETE | `/events/:id/leave/:userId` | User leaves an event |

### POST `/events` — Create an event
`application/json`
```json
{
  "eventName": "Schiedam Jam 2026",
  "host":      "<user_id>"
}
```

### POST `/events/:id/join/:userId`
No body needed — IDs are in the URL.

### DELETE `/events/:id/leave/:userId`
No body needed — IDs are in the URL.

---

## Locations `/locations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/locations` | Get all locations |
| GET | `/locations/:id` | Get a single location |
| GET | `/locations/:id/walls` | Get all walls in a location |
| POST | `/locations` | Create a location |
| PUT | `/locations/:id` | Update a location |
| DELETE | `/locations/:id` | Delete a location |

### POST `/locations` — Create a location
`application/json`
```json
{
  "regionName": "South Holland"
}
```

---

## Graffiti Styles `/graffiti-styles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/graffiti-styles` | Get all styles |
| GET | `/graffiti-styles/:id` | Get a single style |
| GET | `/graffiti-styles/:id/pieces` | Get all pieces with this style |
| POST | `/graffiti-styles` | Create a style |
| PUT | `/graffiti-styles/:id` | Update a style |
| DELETE | `/graffiti-styles/:id` | Delete a style |

### POST `/graffiti-styles` — Create a style
`application/json`
```json
{
  "graffitiStyleName": "Wildstyle"
}
```

The following 10 styles are available by default after seeding:
Tag, Throw-up, Blockbuster, Wildstyle, Stencil, Realistisch, 3D, Character, Abstract, Minimalistisch

---

| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| POST | `/auth/signup`  | Create a user and a JWT            |
| POST | `/auth/login`   | Creates a JWT and a session cookie |
| POST | `/auth/refresh` | Refreshes JWT with session cookie  |
| POST | `/auth/logout`  | Deletes current session cookie     |
---

## Images

Images are uploaded via `multipart/form-data` on the `POST` and `PUT` routes for users and pieces.

Stored paths look like `/uploads/1234567890-123456789.jpg` and are served statically from the Express server.

To display an image on the frontend:
```js
const imgUrl = `http://localhost:8000${user.avatar}`;
// e.g. http://localhost:8000/uploads/1234567890-123456789.jpg
```

---

## Recommended creation order for seeding

## Seeding the database

The seeder fills your local database with fake test data using Faker.js.
This is only for development — never run this on production.

### Setup

Make sure your `.env` file is setup like the .env-example;
EXPRESS_PORT=8000
MONGODB_URI=mongodb://localhost:27017/digitaal-museum
API_KEY=your_api_key

### Running the seeder

Make sure your server is running in one terminal:

```bash
npm run dev
```

Then in a second terminal run:

```bash
npm run seed
```

### What gets seeded

| Endpoint                     | Amount | Notes                                                                                                              |
|------------------------------|--------|--------------------------------------------------------------------------------------------------------------------|
| `POST /seed/users`           | 10     | Random usernames, emails, roles and biographies                                                                    |
| `POST /seed/walls`           | 10     | Random wall names, cities and coordinates                                                                          |
| `POST /seed/graffiti-styles` | 10     | Fixed styles: Tag, Throw-up, Blockbuster, Wildstyle, Stencil, Realistisch, 3D, Character, Abstract, Minimalistisch |
| `POST /seed/pieces`          | 10     | References real seeded users, walls and graffiti styles                                                            |

### Seeding individually

You can also seed individual collections via Postman by sending a POST request with the `x-api-key` header:
POST http://localhost:8000/seed/users
POST http://localhost:8000/seed/walls
POST http://localhost:8000/seed/graffiti-styles
POST http://localhost:8000/seed/pieces

To change the amount, add a body:

```json
{
  "amount": 20
}
```

> **Note:** Always seed in the correct order — pieces depend on users,
> walls and graffiti styles existing first.