const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const userLog = req.body;
        const query = "SELECT * FROM user WHERE name = ?";

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

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user && req.user.userId; 

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Insert new task into the database
        const query = "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)";
        db.query(query, [title, description, userId], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            const taskId = result.insertId;
            res.status(201).json({ message: "Task created successfully", taskId });
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const userId = req.user && req.user.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Retrieve tasks from the database
        const query = "SELECT * FROM tasks WHERE user_id = ?";
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            res.status(200).json({ tasks: result });
        });
    } catch (error) {
        console.error("Error getting tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    login,
    createTask,
    getTasks
};