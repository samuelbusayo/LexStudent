import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  let query = "SELECT * FROM cases";
  const params = [];
  if (req.query.tag) {
    query += " WHERE tags LIKE ?";
    params.push(`%${req.query.tag}%`);
  }
  query += " ORDER BY id";
  const cases = db.prepare(query).all(...params);
  res.json(cases.map(c => ({ ...c, tags: JSON.parse(c.tags || '[]') })));
});

router.get("/featured", (req, res) => {
  const db = getDb();
  const featured = db.prepare("SELECT * FROM cases WHERE is_featured = 1 LIMIT 1").get();
  if (!featured) return res.status(404).json({ error: "No featured case" });
  res.json({ ...featured, tags: JSON.parse(featured.tags || '[]') });
});

router.put("/:id/bookmark", (req, res) => {
  const db = getDb();
  const c = db.prepare("SELECT * FROM cases WHERE id = ?").get(req.params.id);
  if (!c) return res.status(404).json({ error: "Case not found" });
  const newVal = c.bookmarked ? 0 : 1;
  db.prepare("UPDATE cases SET bookmarked = ?, updated_at = datetime('now') WHERE id = ?").run(newVal, req.params.id);
  const updated = db.prepare("SELECT * FROM cases WHERE id = ?").get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags || '[]') });
});

router.get("/tags", (req, res) => {
  const db = getDb();
  const cases = db.prepare("SELECT tags FROM cases").all();
  const allTags = [...new Set(cases.flatMap(c => JSON.parse(c.tags || '[]')))];
  res.json(allTags);
});

router.post("/", (req, res) => {
  const db = getDb();
  const { name, citation, year, description, tags } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Name required" });
  const result = db.prepare(
    `INSERT INTO cases (name, citation, year, description, tags) VALUES (?, ?, ?, ?, ?)`
  ).run(name.trim(), citation || '', Number(year) || 0, description || '', JSON.stringify(tags || []));
  const newCase = db.prepare("SELECT * FROM cases WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ ...newCase, tags: JSON.parse(newCase.tags || '[]') });
});

export default router;
