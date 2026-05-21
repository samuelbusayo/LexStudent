import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lexstudent-dev-secret-key-change-in-production';

router.post("/register", (req, res) => {
  const db = getDb();
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password required" });
  
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(name, email, passwordHash);
  const user = db.prepare("SELECT id, name, email, avatar, streak, badge FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user, token });
});

router.post("/login", (req, res) => {
  const db = getDb();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = db.prepare("SELECT id, name, email, avatar, streak, badge FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
