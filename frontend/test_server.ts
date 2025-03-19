const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user details (Replace with actual DB logic)
const mockUserDetails = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinedDate: "2023-07-15",
  Location: "New York, USA",
  Level: 9,
  levelProgress: 8,
  profileVisibility: "public",
};

// API endpoint to get user details
app.get("/get-userDetails", (req, res) => {
  console.log("User details request received.");
  res.status(200).json(mockUserDetails);
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running on localhost:8080 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
