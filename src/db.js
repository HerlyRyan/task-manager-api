const mysql = require("mysql");

// Konfigurasi koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "db_taskmanager",
});

// Buka koneksi
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to Cloud SQL:", err);
    return;
  }
  console.log("Connected to SQL");
});

module.exports = connection;
