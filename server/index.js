const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cors = require("cors"); // Import cors

const users = require("./routes/api/Users");
const exams = require("./routes/api/Exams");
const logs = require("./routes/api/Logs");

const PORT = process.env.PORT || 3001;

const app = express();

// CORS setup to allow requests from Vercel's domain
const corsOptions = {
  origin: "https://your-vercel-frontend-url.vercel.app", // Replace with your Vercel app URL
  methods: "GET,POST,PUT,DELETE", // Add the allowed methods
  allowedHeaders: "Content-Type,Authorization", // Add any custom headers you're using
  credentials: true, // Enable cookies if necessary
};

// Enable CORS
app.use(cors(corsOptions));

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// Serve static assets if in production
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// API Routes
app.use("/api/users", users);
app.use("/api/exams", exams);
app.use("/api/logs", logs);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
