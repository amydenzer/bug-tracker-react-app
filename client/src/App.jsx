import { useState, useEffect } from "react";

function App() {
  const [bugs, setBugs] = useState([]);
  const [form, setForm] = useState({
    severity: "low",
    description: "",
    state: "open",
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/bugs")
      .then((res) => res.json())
      .then((data) => setBugs(data.bugs))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newBug) => {
        setBugs([...bugs, newBug]);
        setForm({ severity: "low", description: "", state: "open" });
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const severityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "green";
      case "medium":
        return "orange";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  const stateColor = (state) => {
    switch (state.toLowerCase()) {
      case "open":
        return "red";
      case "pending":
        return "orange";
      case "closed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ margin: "20px", fontFamily: "sans-serif" }}>
      <h1>Bug Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          name="description"
          placeholder="Bug description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select name="severity" value={form.severity} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="state" value={form.state} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit">Add Bug</button>
      </form>

      <h2>Bug List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {bugs.map((bug) => (
          <li
            key={bug.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{bug.description}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ backgroundColor: severityColor(bug.severity), color: "white", padding: "2px 5px", borderRadius: "3px" }}>
                {bug.severity}
              </span>
              <span style={{ backgroundColor: stateColor(bug.state), color: "white", padding: "2px 5px", borderRadius: "3px" }}>
                {bug.state}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
