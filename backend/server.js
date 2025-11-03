
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { route } = require("./routes/lostItems");
const lostItemsRouter = require("./routes/lostItems");
const viewlostItemsRoute = require("./routes/viewLostItems");
const foundItemsRouter = require("./routes/foundItems");
const viewfoundItemsRoute = require("./routes/viewFoundItems");
const deleteClaimRoute = require("./routes/delete-claim");

const myClaimsRoute = require("./routes/my-claims");
const key = "Iam@esKApe"

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shreyas@123",
  database: "findit",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});



// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});





// Register User
app.post("/register", async (req, res) => {
    const { name, email, password, role, roll_no, faculty_code, department } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (role !== "student" && role !== "faculty") {
        return res.status(400).json({ error: "Invalid role specified" });
    }

    try {
        // Check if email already exists
        const checkUserSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserSql, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ error: "User with this email already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert into users table
            const insertUserSql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
            db.query(insertUserSql, [name, email, hashedPassword, role], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                const userId = result.insertId; // Get the newly inserted user's ID

                if (role === "student") {
                    if (!roll_no) {
                        return res.status(400).json({ error: "Roll number is required for students" });
                    }

                    const insertStudentSql = "INSERT INTO students (user_id, roll_no) VALUES (?, ?)";
                    db.query(insertStudentSql, [userId, roll_no], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        return res.status(201).json({ message: "Student registered successfully!" });
                    });

                } else if (role === "faculty") {
                    if (!faculty_code) {
                        return res.status(400).json({ error: "Faculty code is required for faculty" });
                    }

                    const insertFacultySql = "INSERT INTO faculty (user_id, faculty_code, department) VALUES (?, ?, ?)";
                    db.query(insertFacultySql, [userId, faculty_code, department || null], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        return res.status(201).json({ message: "Faculty registered successfully!" });
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});





//Login
app.post("/auth/login", (req, res) => {
    const { user_role, roll_no, faculty_code, password } = req.body;
    console.log(user_role)

    let sql, identifier;

    if (user_role === "student") {
        sql = "SELECT users.*, students.roll_no FROM users JOIN students ON users.id = students.user_id WHERE students.roll_no = ?";
        identifier = roll_no;
    } else if (user_role === "faculty") {
        sql = "SELECT users.*, faculty.faculty_code FROM users JOIN faculty ON users.id = faculty.user_id WHERE faculty.faculty_code = ?";
        identifier = faculty_code;
    } else {
        return res.status(400).json({ error: "Invalid user role" });
    }

    db.query(sql, [identifier], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user_role,
                roll_no: user_role === "student" ? user.roll_no : undefined,
                faculty_code: user_role === "faculty" ? user.faculty_code : undefined,
            },
            key,
            { expiresIn: "1h" }
        );

        res.json({ success: true, token, role: user_role });
    });
});





//Lost item report
app.use("/api", lostItemsRouter);

//view lost items
app.use("/api", viewlostItemsRoute);


//Found item report
app.use("/api", foundItemsRouter);

//view found items
app.use("/api", viewfoundItemsRoute);




app.use("/api",myClaimsRoute);
app.use("/api",deleteClaimRoute);





// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
