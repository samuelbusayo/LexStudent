import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";
import { safeEvaluate } from "../services/badgeEvaluator.js";

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
  const userId = result.lastInsertRowid;

  // Evaluate badges for the new user (e.g. "Welcome Counsel" signup badge)
  safeEvaluate(db, userId);

  const user = db.prepare("SELECT id, name, email, avatar, streak, badge, program, campus, ai_messages_used, ai_messages_limit, created_at FROM users WHERE id = ?").get(userId);
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
    const user = db.prepare("SELECT id, name, email, avatar, streak, badge, program, campus, ai_messages_used, ai_messages_limit, created_at FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Update profile (name, email, program, campus)
router.put("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const { name, email, program, campus } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email is taken by another user
    const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, decoded.id);
    if (existing) {
      return res.status(409).json({ error: "Email already in use by another account" });
    }

    db.prepare(
      "UPDATE users SET name = ?, email = ?, program = ?, campus = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(name, email, program || '', campus || '', decoded.id);

    const user = db.prepare("SELECT id, name, email, avatar, streak, badge, program, campus, ai_messages_used, ai_messages_limit, created_at FROM users WHERE id = ?").get(decoded.id);
    const newlyEarned = safeEvaluate(db, decoded.id);
    res.json({ ...user, newlyEarnedBadges: newlyEarned });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Change password
router.put("/password", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(newHash, decoded.id);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Get activity log for the user
router.get("/activity", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const activities = db.prepare(
      "SELECT type, topic_id, goal_id, amount, created_at FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
    ).all(decoded.id);
    res.json(activities);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Get heatmap data for the user
router.get("/heatmap", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const data = db.prepare(
      "SELECT day_index, intensity FROM heatmap_data WHERE user_id = ? ORDER BY day_index"
    ).all(decoded.id);
    res.json(data);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
