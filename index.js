require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());


// ==================================================
// HIRE REQUEST
// ==================================================

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

const HireRequest = mongoose.model(
  "HireRequest",
  hireRequestSchema
);


// ==================================================
// USER ACCOUNT
// ==================================================

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    role: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model(
  "User",
  userSchema
);


// ==================================================
// JOB
// ==================================================

const jobSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },

    customerEmail: {
      type: String,
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    },

    service: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    budget: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model(
  "Job",
  jobSchema
);


// ==================================================
// ASSISTANT PROFILE
// ==================================================

const assistantProfileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    service: {
      type: String,
      required: true
    },

    skills: {
      type: String,
      required: true
    },

    experience: {
      type: String,
      required: true
    },

    rate: {
      type: String,
      required: true
    },

    availability: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const AssistantProfile =
  mongoose.model(
    "AssistantProfile",
    assistantProfileSchema
  );


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {

  res.send(
    "NexaAssist backend is working!"
  );

});


// ==================================================
// ASSISTANTS
// ==================================================

app.get("/assistants", async (req, res) => {

  try {

    const profiles =
      await AssistantProfile.find()
        .sort({
          createdAt: -1
        });

    res.status(200).json(
      profiles
    );

  } catch (error) {

    console.log(
      "Get assistants error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to load assistants."

    });

  }

});


// ==================================================
// HIRE
// ==================================================

app.post("/hire", async (req, res) => {

  try {

    const {
      name,
      email,
      service,
      message
    } = req.body;


    if (
      !name ||
      !email ||
      !service ||
      !message
    ) {

      return res.status(400).json({

        message:
          "Please fill in all fields."

      });

    }


    const hireRequest =
      new HireRequest({

        name,
        email,
        service,
        message

      });


    await hireRequest.save();


    res.status(201).json({

      message:
        "Hire request saved successfully!"

    });

  } catch (error) {

    console.log(
      "Hire request error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to save hire request."

    });

  }

});


// ==================================================
// SIGN UP
// ==================================================

app.post("/signup", async (req, res) => {

  try {

    const {
      fullName,
      email,
      role,
      password,
      confirmPassword
    } = req.body;


    if (
      !fullName ||
      !email ||
      !role ||
      !password ||
      !confirmPassword
    ) {

      return res.status(400).json({

        message:
          "Please fill in all fields."

      });

    }


    if (password !== confirmPassword) {

      return res.status(400).json({

        message:
          "Passwords do not match."

      });

    }


    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Password must be at least 6 characters."

      });

    }


    const existingUser =
      await User.findOne({

        email:
          email.toLowerCase()

      });


    if (existingUser) {

      return res.status(409).json({

        message:
          "An account with this email already exists."

      });

    }


    const hashedPassword =
      crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");


    const user =
      new User({

        fullName,

        email:
          email.toLowerCase(),

        role,

        password:
          hashedPassword

      });


    await user.save();


    res.status(201).json({

      message:
        "Account created successfully!"

    });

  } catch (error) {

    console.log(
      "Signup error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to create account."

    });

  }

});


// ==================================================
// LOGIN
// ==================================================

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (!email || !password) {

      return res.status(400).json({

        message:
          "Please enter your email and password."

      });

    }


    const user =
      await User.findOne({

        email:
          email.toLowerCase()

      });


    if (!user) {

      return res.status(401).json({

        message:
          "Invalid email or password."

      });

    }


    const hashedPassword =
      crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");


    if (
      hashedPassword !==
      user.password
    ) {

      return res.status(401).json({

        message:
          "Invalid email or password."

      });

    }


    res.status(200).json({

      message:
        "Login successful!",

      user: {

        id:
          user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        role:
          user.role

      }

    });

  } catch (error) {

    console.log(
      "Login error:",
      error.message
    );

    res.status(500).json({

      message:
        "Login failed."

    });

  }

});


// ==================================================
// POST JOB
// ==================================================

app.post("/jobs", async (req, res) => {

  try {

    const {
      customerName,
      customerEmail,
      jobTitle,
      service,
      description,
      budget,
      duration
    } = req.body;


    if (
      !customerName ||
      !customerEmail ||
      !jobTitle ||
      !service ||
      !description ||
      !budget ||
      !duration
    ) {

      return res.status(400).json({

        message:
          "Please fill in all job fields."

      });

    }


    const job =
      new Job({

        customerName,

        customerEmail,

        jobTitle,

        service,

        description,

        budget,

        duration

      });


    await job.save();


    res.status(201).json({

      message:
        "Job posted successfully!",

      job: {

        id:
          job._id,

        jobTitle:
          job.jobTitle,

        service:
          job.service,

        status:
          job.status

      }

    });

  } catch (error) {

    console.log(
      "Job posting error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to post job."

    });

  }

});


// ==================================================
// GET ALL JOBS
// ==================================================

app.get("/jobs", async (req, res) => {

  try {

    const jobs =
      await Job.find()
        .sort({
          createdAt: -1
        });


    res.status(200).json(
      jobs
    );

  } catch (error) {

    console.log(
      "Get jobs error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to load jobs."

    });

  }

});


// ==================================================
// SAVE / UPDATE ASSISTANT PROFILE
// ==================================================

app.post(
  "/assistant-profile",
  async (req, res) => {

    try {

      const {
        fullName,
        email,
        service,
        skills,
        experience,
        rate,
        availability,
        bio
      } = req.body;


      if (
        !fullName ||
        !email ||
        !service ||
        !skills ||
        !experience ||
        !rate ||
        !availability ||
        !bio
      ) {

        return res.status(400).json({

          message:
            "Please complete all profile fields."

        });

      }


      const profile =
        await AssistantProfile.findOneAndUpdate(

          {
            email:
              email.toLowerCase()
          },

          {

            fullName,

            email:
              email.toLowerCase(),

            service,

            skills,

            experience,

            rate,

            availability,

            bio

          },

          {

            new: true,

            upsert: true,

            runValidators: true

          }

        );


      res.status(200).json({

        message:
          "Assistant profile saved successfully!",

        profile

      });

    } catch (error) {

      console.log(
        "Assistant profile error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to save assistant profile."

      });

    }

  }
);


// ==================================================
// GET ASSISTANT PROFILE
// ==================================================

app.get(
  "/assistant-profile",
  async (req, res) => {

    try {

      const email =
        req.query.email;


      if (!email) {

        return res.status(400).json({

          message:
            "Assistant email is required."

        });

      }


      const profile =
        await AssistantProfile.findOne({

          email:
            email.toLowerCase()

        });


      if (!profile) {

        return res.status(404).json({

          message:
            "Assistant profile not found."

        });

      }


      res.status(200).json(
        profile
      );

    } catch (error) {

      console.log(
        "Get assistant profile error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load assistant profile."

      });

    }

  }
);


// ==================================================
// MONGODB CONNECTION
// ==================================================

mongoose.connect(
  process.env.MONGODB_URI,
  {
    serverSelectionTimeoutMS: 30000,
    family: 4
  }
)

.then(() => {

  console.log(
    "MongoDB connected!"
  );


  app.listen(
    process.env.PORT || 3000,
    () => {

      console.log(
        "NexaAssist backend running on port 3000"
      );

    }
  );

})

.catch((error) => {

  console.log(
    "MongoDB connection error:",
    error.message
  );

});
