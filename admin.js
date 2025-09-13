import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Prediction Schema =====
const predictionSchema = new mongoose.Schema({
  date: String,
  time: String,
  match: String,
  prediction: String,
  odds: String,
}, { timestamps: true });

const Prediction = mongoose.model("Prediction", predictionSchema, "predictions");

// ===== Admin Login =====
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Invalid password" });
});

// ===== Get Predictions =====
app.get("/predictions", async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching predictions" });
  }
});

// ===== Add Prediction =====
app.post("/predictions", async (req, res) => {
  const { date, time, match, prediction, odds } = req.body;
  try {
    const newPrediction = new Prediction({ date, time, match, prediction, odds });
    await newPrediction.save();
    res.json({ message: "Prediction added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding prediction" });
  }
});

// ===== Delete Prediction =====
app.delete("/predictions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Prediction.findByIdAndDelete(id);
    res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting prediction" });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
