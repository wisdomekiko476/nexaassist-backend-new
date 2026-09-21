require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const hireRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true }
});

const HireRequest = mongoose.model("HireRequest", hireRequestSchema);

app.get("/", (req, res) => {
  res.send("NexaAssist backend is working!");
});

app.get("/assistants", (req, res) => {
  res.json([
    { name: "Alex", service: "Research", price: "$5/task" },
    { name: "Sophia", service: "Customer Support", price: "$7/task" },
    { name: "Daniel", service: "Content", price: "$8/task" },
    { name: "Emma", service: "Administrative", price: "$6/task" },
    { name: "Liam", service: "Data", price: "$5/task" },
    { name: "Olivia", service: "Personal Assistance", price: "$6/task" }
  ]);
});

app.post("/hire", async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    const hireRequest = new HireRequest({
      name,
      email,
      service,
      message
    });

    await hireRequest.save();

    res.status(201).json({
      message: "Hire request saved successfully!"
    });
  } catch (error) {
    console.log("Hire request error:", error.message);

    res.status(500).json({
      message: "Failed to save hire request."
    });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  family: 4
})
.then(() => {
  console.log("MongoDB connected!");

  app.listen(process.env.PORT || 3000, () => {
    console.log("NexaAssist backend running on port 3000");
  });
})
.catch((error) => {
  console.log("MongoDB connection error:", error.message);
});
