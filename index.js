require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HIRE REQUEST
// ===============================

const hireRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true }
});

const HireRequest = mongoose.model("HireRequest", hireRequestSchema);


// ===============================
// USER ACCOUNT
// ===============================

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.send("NexaAssist backend is working!");
});


// ===============================
// ASSISTANTS
// ===============================

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


// ===============================
// HIRE
// ===============================

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


// ===============================
// SIGN UP
// ===============================

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, role, password, confirmPassword } = req.body;

    if (!fullName || !email || !role || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Please fill in all fields."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters."
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      role,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "Account created successfully!"
    });

  } catch (error) {
    console.log("Signup error:", error.message);

    res.status(500).json({
      message: "Failed to create account."
    });
  }
});


// ===============================
// LOGIN
// ===============================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password."
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("Login error:", error.message);

    res.status(500).json({
      message: "Login failed."
    });
  }
});


// ===============================
// MONGODB CONNECTION
// ===============================

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
