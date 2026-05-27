import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getDb } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'materials');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX allowed.'));
  },
});

const router = Router();

router.post("/upload/:topicId", upload.single('file'), (req, res) => {
  const db = getDb();
  const topic = db.prepare("SELECT * FROM topics WHERE id = ?").get(req.params.topicId);
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const result = db.prepare(
    `INSERT INTO materials (topic_id, original_name, stored_name, mime_type, size_bytes, filepath) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.params.topicId, file.originalname, file.filename, file.mimetype, file.size, file.path);

  db.prepare("UPDATE topics SET has_materials = 1, updated_at = datetime('now') WHERE id = ?").run(req.params.topicId);

  const material = db.prepare("SELECT * FROM materials WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(material);
});

router.get("/:topicId", (req, res) => {
  const db = getDb();
  const materials = db.prepare("SELECT * FROM materials WHERE topic_id = ? ORDER BY id DESC").all(req.params.topicId);
  res.json(materials);
});

router.get("/download/:id", (req, res) => {
  const db = getDb();
  const material = db.prepare("SELECT * FROM materials WHERE id = ?").get(req.params.id);
  if (!material) return res.status(404).json({ error: "Material not found" });

  if (fs.existsSync(material.filepath)) {
    res.setHeader('Content-Type', material.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${material.original_name}"`);
    res.sendFile(material.filepath);
  } else {
    res.status(404).json({ error: "File not found on disk" });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const material = db.prepare("SELECT * FROM materials WHERE id = ?").get(req.params.id);
  if (!material) return res.status(404).json({ error: "Material not found" });

  try { if (fs.existsSync(material.filepath)) fs.unlinkSync(material.filepath); } catch (e) {}

  db.prepare("DELETE FROM materials WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
