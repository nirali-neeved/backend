require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("./config/passport");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.use("/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
