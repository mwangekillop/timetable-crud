// Opens the SQLite database, creates the table and seeds sample data when empty.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbFile = path.resolve(__dirname, process.env.DB_FILE || "./campus_crud.db");
const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

// Create the table and trigger
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

// Insert the sample records only if the table has no rows yet
const { total } = db.prepare("SELECT COUNT(*) AS total FROM timetable").get();
if (total === 0) {
  db.exec(fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8"));
}

module.exports = db;
