// Frontend logic: calls the REST API to create, list, edit (PUT) and delete records.

// Empty string = same server that serves this page. For a separately hosted frontend,
// set this to your API address, e.g. "https://your-api.onrender.com".
const API_BASE = "";
const API_URL = API_BASE + "/api/timetable";

const FIELDS = ["course_code", "course_name", "lecturer", "day_of_week", "start_time", "end_time", "venue", "goal"];

const form = document.getElementById("record-form");
const tbody = document.getElementById("records");
const message = document.getElementById("message");
const cancelBtn = document.getElementById("cancel-btn");

// Shows feedback to the user. type is "ok" or "error".
function showMessage(text, type) {
  message.textContent = text;
  message.className = type || "";
}

// Small helper that calls the API and returns parsed JSON (throws on errors).
async function api(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed (" + res.status + ")");
  return data;
}

// Loads every record and rebuilds the table. textContent keeps user text safe.
async function loadRecords() {
  try {
    const rows = await api(API_URL);
    tbody.replaceChildren();
    if (rows.length === 0) {
      const tr = tbody.insertRow();
      const td = tr.insertCell();
      td.colSpan = 9;
      td.textContent = "No records yet.";
      return;
    }
    rows.forEach(addRow);
  } catch (err) {
    showMessage("Could not load records: " + err.message, "error");
  }
}

// Adds one table row for a record, with Edit and Delete buttons.
function addRow(r) {
  const tr = tbody.insertRow();
  const time = r.start_time || r.end_time ? (r.start_time || "") + " - " + (r.end_time || "") : "";
  [r.id, r.course_code, r.course_name, r.lecturer, r.day_of_week, time, r.venue, r.goal].forEach((v) => {
    tr.insertCell().textContent = v == null ? "" : v;
  });

  const actions = tr.insertCell();
  actions.className = "row-actions";

  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "small secondary";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEdit(r.id));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "small danger";
  del.textContent = "Delete";
  del.addEventListener("click", () => deleteRecord(r.id));

  actions.append(edit, del);
}

// Loads one record into the form for editing.
async function startEdit(id) {
  try {
    const r = await api(API_URL + "/" + id);
    document.getElementById("record-id").value = r.id;
    FIELDS.forEach((f) => (document.getElementById(f).value = r[f] == null ? "" : r[f]));
    document.getElementById("form-title").textContent = "Edit class #" + r.id;
    document.getElementById("save-btn").textContent = "Update";
    cancelBtn.hidden = false;
    showMessage("", "");
    form.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showMessage(err.message, "error");
  }
}

// Clears the form and switches back to "add" mode.
function resetForm() {
  form.reset();
  document.getElementById("record-id").value = "";
  document.getElementById("form-title").textContent = "Add a class";
  document.getElementById("save-btn").textContent = "Save";
  cancelBtn.hidden = true;
}

// Create (POST) or update (PUT) depending on whether an id is set.
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = {};
  FIELDS.forEach((f) => (body[f] = document.getElementById(f).value.trim()));

  if (!body.course_code) {
    showMessage("Course code is required.", "error");
    return;
  }

  const id = document.getElementById("record-id").value;
  try {
    await api(id ? API_URL + "/" + id : API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    showMessage(id ? "Record updated." : "Record created.", "ok");
    resetForm();
    loadRecords();
  } catch (err) {
    showMessage(err.message, "error");
  }
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  showMessage("", "");
});

// Deletes a record after confirmation, then refreshes the table.
async function deleteRecord(id) {
  if (!confirm("Delete record #" + id + "?")) return;
  try {
    await api(API_URL + "/" + id, { method: "DELETE" });
    showMessage("Record deleted.", "ok");
    if (document.getElementById("record-id").value === String(id)) resetForm();
    loadRecords();
  } catch (err) {
    showMessage(err.message, "error");
  }
}

loadRecords();
