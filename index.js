const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const jobRoutes = require("./routes/job");
const cors = require("cors");

dotenv.config();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
    // origin: 'https://<your-netlify-domain>.netlify.app',
    origin: 'https://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // If you need to send cookies or authentication headers
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


// app.get("/", (req, res) => {
//     res.send("Hello World");
// });
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



