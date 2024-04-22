const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const userLog = req.body;
    const query = "SELECT * FROM user WHERE username = ?";

    db.query(query, [userLog.username], async (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Pastikan result adalah array yang tidak kosong
      const user = result && result.length > 0 ? result[0] : null;

      if (user) {
        // Verifikasi kata sandi
        const passwordMatch = await bcrypt.compare(
          userLog.password,
          user.password
        );

        if (passwordMatch) {
          // Buat token JWT sebagai tanda otentikasi
          const token = jwt.sign(
            { userId: user.user_id, username: user.username },
            "secret_key",
            { expiresIn: "1h" }
          );

          res
            .status(200)
            .json({ message: "Log in succes!", token, userId: user.user_id });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = login