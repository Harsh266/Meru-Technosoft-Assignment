require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());


app.use(cors({
  origin: "https://meru-technosoft-assignment.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MongoDB URI is missing in .env file");
    process.exit(1);
}

app.use("/api/invoices", require("./routes/invoiceRoutes"));

mongoose.connect(MONGO_URI,{
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.send("🚀 Backend is running & MongoDB connected!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));