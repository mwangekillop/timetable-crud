-- Single table for the "Student Timetable & Goals" theme (resource: timetable)
CREATE TABLE IF NOT EXISTS timetable (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code TEXT NOT NULL,
  course_name TEXT,
  lecturer    TEXT,
  day_of_week TEXT,
  start_time  TEXT,
  end_time    TEXT,
  venue       TEXT,
  goal        TEXT,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Keep updated_at current whenever a row is changed (SQLite has no ON UPDATE clause)
CREATE TRIGGER IF NOT EXISTS timetable_set_updated_at
AFTER UPDATE ON timetable
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE timetable SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
