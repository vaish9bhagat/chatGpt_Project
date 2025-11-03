const express = require("express");
const authRoutes = require("./routes/authroutes");
const chatRoutes = require("./routes/chatroutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use("/auth", authRoutes);
app.use("/", chatRoutes);

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

module.exports = app;