// Express REST API for the timetable resource (GET, POST, PUT, DELETE).
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Serve the frontend from the same server so one deployment hosts everything
app.use(express.static(path.join(__dirname, "..", "frontend")));

const FIELDS = ["course_code", "course_name", "lecturer", "day_of_week", "start_time", "end_time", "venue", "goal"];

// Cleans the request body and returns { data, error }.
function readBody(body, requireCode) {
  const data = {};
  for (const f of FIELDS) {
    const v = body && body[f];
    data[f] = v === undefined || v === null ? null : String(v).trim();
  }
  if (requireCode && !data.course_code) {
    return { error: "course_code is required" };
  }
  if (data.course_code !== null && data.course_code.length > 20) {
    return { error: "course_code must be 20 characters or fewer" };
  }
  return { data };
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "id must be a positive integer" });
    return null;
  }
  return id;
}

// GET /api/timetable - list all records
app.get("/api/timetable", (req, res) => {
  const rows = db.prepare("SELECT * FROM timetable ORDER BY id").all();
  res.json(rows);
});

// GET /api/timetable/:id - get one record
app.get("/api/timetable/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const row = db.prepare("SELECT * FROM timetable WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Record not found" });
  res.json(row);
});

// POST /api/timetable - create a record
app.post("/api/timetable", (req, res) => {
  const { data, error } = readBody(req.body, true);
  if (error) return res.status(400).json({ error });
  const result = db
    .prepare(
      `INSERT INTO timetable (${FIELDS.join(", ")}) VALUES (${FIELDS.map((f) => "@" + f).join(", ")})`
    )
    .run(data);
  const created = db.prepare("SELECT * FROM timetable WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/timetable/:id - update a record
app.put("/api/timetable/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const existing = db.prepare("SELECT * FROM timetable WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Record not found" });

  // Fields missing from the body keep their current value
  const merged = { ...existing, ...req.body };
  const { data, error } = readBody(merged, true);
  if (error) return res.status(400).json({ error });

  db.prepare(
    `UPDATE timetable SET ${FIELDS.map((f) => `${f} = @${f}`).join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = @id`
  ).run({ ...data, id });
  res.json(db.prepare("SELECT * FROM timetable WHERE id = ?").get(id));
});

// DELETE /api/timetable/:id - delete a record
app.delete("/api/timetable/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const result = db.prepare("DELETE FROM timetable WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Record not found" });
  res.json({ message: "Record deleted", id });
});

// Unknown API routes return JSON, not HTML
app.use("/api", (req, res) => res.status(404).json({ error: "Route not found" }));

// Bad JSON bodies and unexpected errors
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
