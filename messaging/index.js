import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ===== MySQL connection =====
const db = mysql.createPool({
  host: "localhost",
  user: "medicuser",
  password: "Medic@123",
  database: "bank",
  port: 3306
});

// ===== ROUTES =====

// ✅ Root: Fetch all customers
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ✅ Get a customer by ID
app.get("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM customer WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Customer not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// ✅ Create admin
app.post("/admin", async (req, res) => {
  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM admin WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO admin (name, email, username, password) VALUES (?, ?, ?, ?)",
      [name, email, username, hashedPassword]
    );

    res.json({ message: "Admin account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

// ✅ Admin login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Required fields missing" });

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
    if (!rows.length) return res.status(404).json({ error: "Admin not found" });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: admin.id, name: admin.name, username: admin.username, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Fetch user by username (admin or customer)
app.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const [adminRows] = await db.query(
      "SELECT id, name, email, username, 'admin' AS role FROM admin WHERE username = ?",
      [username]
    );
    if (adminRows.length) return res.json(adminRows[0]);

    const [customerRows] = await db.query(
      "SELECT id, first_name AS name, email_email AS email, account_number AS username, 'customer' AS role FROM customer WHERE account_number = ?",
      [username]
    );
    if (customerRows.length) return res.json(customerRows[0]);

    res.status(404).json({ error: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ==================== CUSTOMER CRUD ====================

// ✅ Create a new customer
app.post("/customer", async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    phone_number,
    email_email,
    account_number,
  } = req.body;

  if (!first_name || !last_name || !account_number) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM customer WHERE account_number = ? OR email_email = ?",
      [account_number, email_email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Account number or email already exists" });
    }

    await db.query(
      `INSERT INTO customer 
        (first_name, middle_name, last_name, date_of_birth, phone_number, email_email, account_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        middle_name || null,
        last_name,
        date_of_birth || null,
        phone_number || null,
        email_email || null,
        account_number,
      ]
    );

    res.json({ message: "Customer created successfully" });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// ✅ Get all customers
app.get("/customers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ✅ Update a customer
app.put("/customer/:id", async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    phone_number,
    email_email,
    account_number,
  } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM customer WHERE id = ?", [id]);
    if (!existing.length) return res.status(404).json({ error: "Customer not found" });

    await db.query(
      `UPDATE customer 
       SET first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, 
           phone_number = ?, email_email = ?, account_number = ?
       WHERE id = ?`,
      [
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        phone_number,
        email_email,
        account_number,
        id,
      ]
    );

    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// ✅ Delete a customer
app.delete("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM customer WHERE id = ?", [id]);
    if (!existing.length) return res.status(404).json({ error: "Customer not found" });

    await db.query("DELETE FROM customer WHERE id = ?", [id]);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

// ==================== MESSAGES ====================

// ✅ Get all messages for a specific customer
app.get("/messages/:customer_id", async (req, res) => {
  const { customer_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM messages 
       WHERE customer_id = ? 
       ORDER BY created_at ASC`,
      [customer_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Send a message
app.post("/messages", async (req, res) => {
  const { sender, receiver, content, customer_id } = req.body;

  if (!sender || !receiver || !content || !customer_id) {
    return res.status(400).json({ error: "Missing message data" });
  }

  try {
    const created_at = new Date();

    await db.query(
      "INSERT INTO messages (sender, receiver, content, created_at, customer_id) VALUES (?, ?, ?, ?, ?)",
      [sender, receiver, content, created_at, customer_id]
    );

    io.emit("chat message", { sender, receiver, content, created_at, customer_id });

    res.json({
      message: "Message sent successfully",
      data: { sender, receiver, content, created_at, customer_id },
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ===== Socket.IO handler =====
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", async ({ sender, receiver, content, customer_id }) => {
    try {
      const created_at = new Date();
      await db.query(
        "INSERT INTO messages (sender, receiver, content, created_at, customer_id) VALUES (?, ?, ?, ?, ?)",
        [sender, receiver, content, created_at, customer_id]
      );

      io.emit("chat message", { sender, receiver, content, customer_id, created_at });
    } catch (err) {
      console.error("Socket message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ===== Start server =====
const PORT = 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

