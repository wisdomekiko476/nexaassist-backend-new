require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("NexaAssist backend is working!");
});

// Assistants route
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

// Hire request database structure
const hireRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const HireRequest = mongoose.model("HireRequest", hireRequestSchema);

// Hire request route
app.post("/hire", async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    const newHireRequest = new HireRequest({
      name,
      email,
      service,
      message
    });

    await newHireRequest.save();

    res.json({
      message: "Hire request saved successfully!"
    });
  } catch (error) {
    console.error("Hire request error:", error);

    res.status(500).json({
      message: "Could not save hire request."
    });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    family: 4
  })
  .then(() => {
    console.log("MongoDB connected!");

    app.listen(3000, () => {
      console.log("NexaAssist backend running on port 3000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
