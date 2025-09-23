const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173"],
};

const PORT = 8080;

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // parse JSON request bodies

// Data store
let bugs = [];          // store the bugs
let bugIdCounter = 1;   // auto-incrementing ID

// GET all bugs
app.get("/api/bugs", (req, res) => {
    res.json({ bugs });
});

// POST a new bug
app.post("/api/bugs", (req, res) => {
    const { severity, description, state } = req.body;

    // Basic validation (optional but useful)
    if (!severity || !description || !state) {
        return res.status(400).json({ error: "severity, description, and state are required" });
    }

    const newBug = {
        id: bugIdCounter++, // auto-number
        severity,
        description,
        state
    };

    bugs.push(newBug);

    res.status(201).json(newBug); // 201 = created
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
