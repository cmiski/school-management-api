# School Management API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/license/isc-license-txt)

Production-style backend APIs to manage school data using Node.js, Express, and MySQL.

The system supports:

- Adding a school with strict payload validation.
- Listing schools sorted by distance from a user location.
- Secure and clean API behavior with rate limiting, error handling, and structured responses.

## Table Of Contents

1. [Project Objective](#project-objective)
2. [Tech Stack](#tech-stack)
3. [System Design](#system-design)
4. [Project Structure](#project-structure)
5. [Setup Guide](#setup-guide)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Validation Rules](#validation-rules)
10. [Error Response Format](#error-response-format)
11. [Assessment Mapping](#assessment-mapping)
12. [Known Notes](#known-notes)

## Project Objective

Build Node.js APIs for school management that:

- Store school details in MySQL.
- Validate incoming data.
- Return schools sorted by geographical proximity using latitude and longitude.

## Tech Stack

- Runtime: Node.js (ES Modules)
- Framework: Express.js
- Database: MySQL (`mysql2/promise`)
- Validation: Joi
- Security & Ops: Helmet, CORS, Morgan, Express Rate Limit

## System Design

```text
Client
  |
  v
Express Routes
  |
  v
Validation Middleware (Joi)
  |
  v
Controller Layer
  |
  v
Service Layer
  |
  v
MySQL (schools table)
```

Distance sorting uses the Haversine formula (`src/utils/calculateDistance.js`).

## Project Structure

```text
school-management-api/
|-- server.js
|-- src/
|   |-- app.js
|   |-- config/
|   |   |-- db.js
|   |   |-- testDb.js
|   |   `-- schema.sql
|   |-- controllers/
|   |   `-- schoolController.js
|   |-- middlewares/
|   |   |-- asyncHandler.js
|   |   |-- errorMiddleware.js
|   |   |-- rateLimiter.js
|   |   `-- validateMiddleware.js
|   |-- routes/
|   |   `-- schoolRoutes.js
|   |-- services/
|   |   `-- schoolService.js
|   |-- utils/
|   |   |-- AppError.js
|   |   `-- calculateDistance.js
|   `-- validators/
|       `-- schoolValidator.js
`-- README.md
```

## Setup Guide

1. Clone and install dependencies:

```bash
git clone <your-repo-url>
cd school-management-api
npm install
```

2. Create a `.env` file in project root:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

3. Ensure MySQL database exists:

```sql
CREATE DATABASE school_management;
```

4. Start server:

```bash
npm run dev
```

On startup, the app:

- Tests DB connection.
- Creates `schools` table automatically if it does not exist.

## Environment Variables

| Variable      | Description         | Example             |
| ------------- | ------------------- | ------------------- |
| `PORT`        | API server port     | `5000`              |
| `NODE_ENV`    | Environment mode    | `development`       |
| `DB_HOST`     | MySQL host          | `localhost`         |
| `DB_USER`     | MySQL user          | `root`              |
| `DB_PASSWORD` | MySQL password      | `secret`            |
| `DB_NAME`     | MySQL database name | `school_management` |

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

## API Documentation

Base URL (local): `http://localhost:5000`

Supported route styles:

- Required-task style: `/addSchool`, `/listSchools`
- Versioned style: `/api/v1/schools/addSchool`, `/api/v1/schools/listSchools`

### 1) Add School

- Method: `POST`
- Endpoint: `/addSchool`
- Content-Type: `application/json`

Request Body:

```json
{
  "name": "Summer Valley School",
  "address": "Saharanpur Road, Dehradun",
  "latitude": 30.3165,
  "longitude": 78.0322
}
```

Success Response (`201`):

```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1
}
```

cURL:

```bash
curl -X POST http://localhost:5000/addSchool \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Summer Valley School\",\"address\":\"Saharanpur Road, Dehradun\",\"latitude\":30.3165,\"longitude\":78.0322}"
```

### 2) List Schools By Proximity

- Method: `GET`
- Endpoint: `/listSchools`
- Query Params: `latitude`, `longitude`

Example Request:

```http
GET /listSchools?latitude=30.3165&longitude=78.0322
```

Success Response (`200`):

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Summer Valley School",
      "address": "Saharanpur Road, Dehradun",
      "latitude": 30.3165,
      "longitude": 78.0322,
      "distance": 0
    },
    {
      "id": 2,
      "name": "Sun Valley International School",
      "address": "Indirapuram, Ghaziabad",
      "latitude": 28.6449,
      "longitude": 77.37,
      "distance": 196.61
    }
  ]
}
```

cURL:

```bash
curl "http://localhost:5000/listSchools?latitude=30.3165&longitude=78.0322"
```

## Validation Rules

For `POST /addSchool`:

- `name`: required string, trimmed, length `3-255`
- `address`: required string, trimmed, length `5-500`
- `latitude`: required number, range `-90 to 90`
- `longitude`: required number, range `-180 to 180`

For `GET /listSchools` query:

- `latitude`: required number, range `-90 to 90`
- `longitude`: required number, range `-180 to 180`

## Error Response Format

All errors follow a consistent shape:

```json
{
  "success": false,
  "status": "fail",
  "message": "Validation or runtime error message"
}
```

Common status codes:

- `400` invalid input
- `404` route not found
- `429` too many requests
- `500` internal server error

## Assessment Mapping

Requirement checklist:

- `schools` table with required fields: completed
- `POST /addSchool`: completed
- Input validation before insert: completed
- `GET /listSchools`: completed
- Distance-based sort by user coordinates: completed

## Note

- Rate limit is enabled globally (`100` requests per `15` minutes per IP).
- Distance is returned in kilometers, rounded to 2 decimals.
