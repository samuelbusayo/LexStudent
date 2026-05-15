import 'dotenv/config'
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { initDb } from "./db.js"
import { seedDatabase } from "./seed.js"
import coursesRouter from "./routes/courses.js"
import goalsRouter from "./routes/goals.js"
import progressRouter from "./routes/progress.js"
import casesRouter from "./routes/cases.js"
import authRouter from "./routes/auth.js"
import badgesRouter from "./routes/badges.js"
import remindersRouter from "./routes/reminders.js"
import summariesRouter from "./routes/summaries.js"
import materialsRouter from "./routes/materials.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(morgan('dev'))

// Initialize database
const db = initDb()
seedDatabase(db)
app.locals.db = db

// Routes
app.use("/api/auth", authRouter)
app.use("/api/courses", coursesRouter)
app.use("/api/goals", goalsRouter)
app.use("/api/progress", progressRouter)
app.use("/api/cases", casesRouter)
app.use("/api/badges", badgesRouter)
app.use("/api/reminders", remindersRouter)
app.use("/api/summaries", summariesRouter)
app.use("/api/materials", materialsRouter)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "sqlite" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error", message: err.message })
})

app.listen(PORT, () => {
  console.log(`LexStudent server running on port ${PORT}`)
})
