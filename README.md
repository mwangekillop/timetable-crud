# ICT251 Activity 4 - Student Timetable & Goals (Single-Table CRUD)

A Node.js/Express REST API with a SQLite database and a simple HTML/JavaScript page that performs CRUD from the browser.

- **Theme:** Student Timetable & Goals
- **Resource / table:** `timetable`
- **Live API:** https://YOUR-API.onrender.com/api/timetable
- **Live page:** https://YOUR-API.onrender.com/

## Structure

```
backend/
  .env           PORT, DB_FILE, CORS_ORIGIN
  package.json
  schema.sql     timetable table (+ updated_at trigger)
  seed.sql       12 sample records
  db.js          opens SQLite, creates table, seeds when empty
  server.js      Express API + serves the frontend
frontend/
  index.html
  app.js
```

## Table: `timetable`

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | primary key, auto-increment |
| course_code | TEXT | NOT NULL |
| course_name, lecturer, day_of_week, start_time, end_time, venue, goal | TEXT | optional |
| created_at, updated_at | TEXT | default CURRENT_TIMESTAMP; updated_at refreshed by a trigger and by PUT |

## Run locally

```
cd backend
npm install
npm start
```

Open http://localhost:3000. The database file is created and seeded with 12 records on first start.

## Endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | /api/timetable | List all records |
| GET | /api/timetable/:id | Get one record |
| POST | /api/timetable | Create (body JSON; `course_code` required) |
| PUT | /api/timetable/:id | Update (missing fields keep their value) |
| DELETE | /api/timetable/:id | Delete |

Example POST body:

```json
{
  "course_code": "ICT300",
  "course_name": "Cloud Computing",
  "lecturer": "Mr. Mulenga",
  "day_of_week": "Friday",
  "start_time": "13:00",
  "end_time": "15:00",
  "venue": "Lab 4",
  "goal": "Deploy a cloud app"
}
```

All responses are JSON. Errors look like `{ "error": "message" }` (400 invalid input, 404 not found).

## Deploy on Render (Web Service)

1. Push this folder to GitHub.
2. Render > New > Web Service > connect the repository.
3. Root Directory: `backend` | Build Command: `npm install` | Start Command: `npm start`.
4. Add environment variables from `backend/.env` (Render sets `PORT` itself).
5. Use the `onrender.com` address for your submission links.

Note: on Render's free plan the SQLite file resets on redeploy or restart; sample data is re-seeded automatically. Attach a persistent disk and set `DB_FILE` to its path if you need data to persist.

## Postman checklist (record a video)

Show URL, method, body and JSON response for: GET all, GET one, POST, PUT, DELETE.
