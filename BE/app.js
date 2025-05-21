// server/index.js
const express = require("express");
const cors = require("cors");
const supabase = require("./config/config.js"); // Adjust the path as necessary

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("testing").select("*");
  console.log({ data, error });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
  

app.post("/api/users", async (req, res) => {
  const { dekripsi } = req.body;

  const { data, error } = await supabase
    .from("testing")
    .insert([{ dekripsi }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
