const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const corsOptions = process.env.NODE_ENV === "production"
  ? {} // allow all in production
  : { origin: ["http://localhost:5173"] };
app.use(cors(corsOptions));
app.use(express.json()); // parse JSON request bodies

// Data store
let bugs = [];
let bugIdCounter = 1;

// API routes
app.get("/api/bugs", (req, res) => {
  res.json({ bugs });
});

app.post("/api/bugs", (req, res) => {
  const { severity, description, state } = req.body;

  if (!severity || !description || !state) {
    return res.status(400).json({ error: "severity, description, and state are required" });
  }

  const newBug = {
    id: bugIdCounter++,
    severity,
    description,
    state,
  };

  bugs.push(newBug);
  res.status(201).json(newBug);
});

// Serve React build (production)
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// All other routes -> serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
