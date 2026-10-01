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
    },

    verified: {
      type: Boolean,
      default: false
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
// APPLICATION
// ==================================================

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    },

    assistantName: {
      type: String,
      required: true
    },

    assistantEmail: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);


// ==================================================
// HIRE / JOB ASSIGNMENT
// ==================================================

const hireSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    },

    customerName: {
      type: String,
      required: true
    },

    customerEmail: {
      type: String,
      required: true
    },

    assistantName: {
      type: String,
      required: true
    },

    assistantEmail: {
      type: String,
      required: true
    },

    budget: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Hired"
    }
  },
  {
    timestamps: true
  }
);

const Hire = mongoose.model(
  "Hire",
  hireSchema
);


// ==================================================
// NOTIFICATIONS
// ==================================================

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true
    },

    recipientName: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null
    },

    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);


// ==================================================
// NOTIFICATION HELPER
// ==================================================

async function createNotification({
  recipientEmail,
  recipientName,
  type,
  title,
  message,
  jobId = null
}) {

  try {

    if (!recipientEmail || !recipientName) {
      return;
    }

    const notification =
      new Notification({

        recipientEmail:
          recipientEmail.toLowerCase(),

        recipientName,

        type,

        title,

        message,

        jobId,

        read: false

      });

    await notification.save();

  } catch (error) {

    console.log(
      "Notification error:",
      error.message
    );

  }

}


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
// OLD HIRE REQUEST
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


    /*
      Return the account information
      at the top level so the frontend
      can correctly identify the role.
    */

    res.status(200).json({

      message:
        "Login successful!",

      id:
        user._id,

      fullName:
        user.fullName,

      email:
        user.email,

      role:
        user.role

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


      const existingProfile =
        await AssistantProfile.findOne({
          email:
            email.toLowerCase()
        });


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


      if (!existingProfile) {
        profile.verified = false;
        await profile.save();
      }


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
// APPLY FOR JOB
// ==================================================

app.post(
  "/applications",
  async (req, res) => {

    try {

      const {
        jobId,
        assistantName,
        assistantEmail
      } = req.body;


      if (
        !jobId ||
        !assistantName ||
        !assistantEmail
      ) {

        return res.status(400).json({

          message:
            "Job and assistant information are required."

        });

      }


      const job =
        await Job.findById(jobId);


      if (!job) {

        return res.status(404).json({

          message:
            "Job not found."

        });

      }


      if (job.status !== "Open") {

        return res.status(400).json({

          message:
            "This job is no longer available."

        });

      }


      const existingApplication =
        await Application.findOne({

          jobId: job._id,

          assistantEmail:
            assistantEmail.toLowerCase()

        });


      if (existingApplication) {

        return res.status(409).json({

          message:
            "You have already applied for this job."

        });

      }


      const application =
        new Application({

          jobId:
            job._id,

          jobTitle:
            job.jobTitle,

          assistantName,

          assistantEmail:
            assistantEmail.toLowerCase(),

          status:
            "Pending"

        });


      await application.save();


      await createNotification({

        recipientEmail:
          job.customerEmail,

        recipientName:
          job.customerName,

        type:
          "application",

        title:
          "New Job Application",

        message:
          `${assistantName} applied for your job: ${job.jobTitle}`,

        jobId:
          job._id

      });


      res.status(201).json({

        message:
          "Application submitted successfully!",

        application

      });

    } catch (error) {

      console.log(
        "Application error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to submit application."

      });

    }

  }
);


// ==================================================
// GET ASSISTANT APPLICATIONS
// ==================================================

app.get(
  "/applications",
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


      const applications =
        await Application.find({

          assistantEmail:
            email.toLowerCase()

        })
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        applications
      );

    } catch (error) {

      console.log(
        "Get applications error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load applications."

      });

    }

  }
);


// ==================================================
// GET CUSTOMER APPLICATIONS
// ==================================================

app.get(
  "/customer-applications",
  async (req, res) => {

    try {

      const email =
        req.query.email;


      if (!email) {

        return res.status(400).json({

          message:
            "Customer email is required."

        });

      }


      const jobs =
        await Job.find({

          customerEmail:
            email.toLowerCase()

        });


      const jobIds =
        jobs.map(
          job => job._id
        );


      const applications =
        await Application.find({

          jobId: {
            $in: jobIds
          }

        })
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        applications
      );

    } catch (error) {

      console.log(
        "Get customer applications error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load customer applications."

      });

    }

  }
);


// ==================================================
// HIRE ASSISTANT
// ==================================================

app.post(
  "/hire-assistant",
  async (req, res) => {

    try {

      const {
        jobId,
        applicationId,
        customerEmail
      } = req.body;


      if (
        !jobId ||
        !applicationId ||
        !customerEmail
      ) {

        return res.status(400).json({

          message:
            "Job, application and customer information are required."

        });

      }


      const job =
        await Job.findOne({

          _id: jobId,

          customerEmail:
            customerEmail.toLowerCase()

        });


      if (!job) {

        return res.status(404).json({

          message:
            "Job not found or you are not the owner of this job."

        });

      }


      if (job.status !== "Open") {

        return res.status(400).json({

          message:
            "This job has already been assigned."

        });

      }


      const application =
        await Application.findOne({

          _id: applicationId,

          jobId: job._id

        });


      if (!application) {

        return res.status(404).json({

          message:
            "Application not found."

        });

      }


      if (application.status !== "Pending") {

        return res.status(400).json({

          message:
            "This application has already been processed."

        });

      }


      const existingHire =
        await Hire.findOne({

          jobId: job._id

        });


      if (existingHire) {

        return res.status(409).json({

          message:
            "An assistant has already been hired for this job."

        });

      }


      const hire =
        new Hire({

          jobId:
            job._id,

          jobTitle:
            job.jobTitle,

          customerName:
            job.customerName,

          customerEmail:
            job.customerEmail,

          assistantName:
            application.assistantName,

          assistantEmail:
            application.assistantEmail,

          budget:
            job.budget,

          status:
            "Hired"

        });


      await hire.save();


      application.status =
        "Accepted";

      await application.save();


      job.status =
        "Assigned";

      await job.save();


      await Application.updateMany(

        {
          jobId: job._id,

          _id: {
            $ne: application._id
          },

          status:
            "Pending"

        },

        {
          $set: {
            status:
              "Rejected"
          }
        }

      );


      await createNotification({

        recipientEmail:
          application.assistantEmail,

        recipientName:
          application.assistantName,

        type:
          "hire",

        title:
          "You Have Been Hired!",

        message:
          `You have been hired for the job: ${job.jobTitle}`,

        jobId:
          job._id

      });


      res.status(200).json({

        message:
          "Assistant hired successfully!",

        hire

      });

    } catch (error) {

      console.log(
        "Hire assistant error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to hire assistant."

      });

    }

  }
);


// ==================================================
// GET CUSTOMER HIRES
// ==================================================

app.get(
  "/customer-hires",
  async (req, res) => {

    try {

      const email =
        req.query.email;


      if (!email) {

        return res.status(400).json({

          message:
            "Customer email is required."

        });

      }


      const hires =
        await Hire.find({

          customerEmail:
            email.toLowerCase()

        })
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        hires
      );

    } catch (error) {

      console.log(
        "Get customer hires error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load customer hires."

      });

    }

  }
);


// ==================================================
// GET ASSISTANT HIRES
// ==================================================

app.get(
  "/assistant-hires",
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


      const hires =
        await Hire.find({

          assistantEmail:
            email.toLowerCase()

        })
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        hires
      );

    } catch (error) {

      console.log(
        "Get assistant hires error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load assistant hires."

      });

    }

  }
);


// ==================================================
// NOTIFICATIONS - GET
// ==================================================

app.get(
  "/notifications",
  async (req, res) => {

    try {

      const email =
        req.query.email;


      if (!email) {

        return res.status(400).json({

          message:
            "Email is required."

        });

      }


      const notifications =
        await Notification.find({

          recipientEmail:
            email.toLowerCase()

        })
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        notifications
      );

    } catch (error) {

      console.log(
        "Get notifications error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load notifications."

      });

    }

  }
);


// ==================================================
// NOTIFICATIONS - MARK AS READ
// ==================================================

app.patch(
  "/notifications/:id/read",
  async (req, res) => {

    try {

      const notification =
        await Notification.findById(
          req.params.id
        );


      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found."

        });

      }


      notification.read =
        true;

      await notification.save();


      res.status(200).json({

        message:
          "Notification marked as read.",

        notification

      });

    } catch (error) {

      console.log(
        "Mark notification error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to update notification."

      });

    }

  }
);


// ==================================================
// MESSAGES
// ==================================================

const messageSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    senderName: {
      type: String,
      required: true
    },

    senderEmail: {
      type: String,
      required: true
    },

    receiverName: {
      type: String,
      required: true
    },

    receiverEmail: {
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

const Message = mongoose.model(
  "Message",
  messageSchema
);


// ==================================================
// SEND MESSAGE
// ==================================================

app.post(
  "/messages",
  async (req, res) => {

    try {

      const {
        jobId,
        senderName,
        senderEmail,
        receiverName,
        receiverEmail,
        message
      } = req.body;


      if (
        !jobId ||
        !senderName ||
        !senderEmail ||
        !receiverName ||
        !receiverEmail ||
        !message
      ) {

        return res.status(400).json({

          message:
            "All message fields are required."

        });

      }


      const job =
        await Job.findById(jobId);


      if (!job) {

        return res.status(404).json({

          message:
            "Job not found."

        });

      }


      const hire =
        await Hire.findOne({

          jobId: job._id,

          $or: [

            {
              customerEmail:
                senderEmail.toLowerCase()
            },

            {
              assistantEmail:
                senderEmail.toLowerCase()
            }

          ]

        });


      if (!hire) {

        return res.status(403).json({

          message:
            "You can only message about a job you have been hired for."

        });

      }


      const newMessage =
        new Message({

          jobId:
            job._id,

          senderName,

          senderEmail:
            senderEmail.toLowerCase(),

          receiverName,

          receiverEmail:
            receiverEmail.toLowerCase(),

          message

        });


      await newMessage.save();


      let notificationEmail;
      let notificationName;

      if (
        hire.customerEmail.toLowerCase() ===
        senderEmail.toLowerCase()
      ) {

        notificationEmail =
          hire.assistantEmail;

        notificationName =
          hire.assistantName;

      } else {

        notificationEmail =
          hire.customerEmail;

        notificationName =
          hire.customerName;

      }


      await createNotification({

        recipientEmail:
          notificationEmail,

        recipientName:
          notificationName,

        type:
          "message",

        title:
          "New Message",

        message:
          `${senderName} sent you a message about: ${job.jobTitle}`,

        jobId:
          job._id

      });


      res.status(201).json({

        message:
          "Message sent successfully!",

        data:
          newMessage

      });

    } catch (error) {

      console.log(
        "Send message error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to send message."

      });

    }

  }
);


// ==================================================
// GET JOB MESSAGES
// ==================================================

app.get(
  "/messages",
  async (req, res) => {

    try {

      const {
        jobId,
        email
      } = req.query;


      if (!jobId || !email) {

        return res.status(400).json({

          message:
            "Job ID and email are required."

        });

      }


      const hire =
        await Hire.findOne({

          jobId: jobId,

          $or: [

            {
              customerEmail:
                email.toLowerCase()
            },

            {
              assistantEmail:
                email.toLowerCase()
            }

          ]

        });


      if (!hire) {

        return res.status(403).json({

          message:
            "You do not have access to these messages."

        });

      }


      const messages =
        await Message.find({

          jobId:
            jobId

        }).sort({

          createdAt:
            1

        });


      res.status(200).json(
        messages
      );

    } catch (error) {

      console.log(
        "Get messages error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load messages."

      });

    }

  }
);


// ==================================================
// ADMIN ROUTES
// ==================================================


// ==================================================
// ADMIN USERS
// ==================================================

app.get(
  "/admin/users",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


      const users =
        await User.find(
          {},
          {
            password: 0
          }
        )
        .sort({
          createdAt: -1
        });


      res.status(200).json(
        users
      );

    } catch (error) {

      console.log(
        "Admin users error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load users."

      });

    }

  }
);


// ==================================================
// ADMIN ASSISTANTS
// ==================================================

app.get(
  "/admin/assistants",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


      const assistants =
        await AssistantProfile.find()
          .sort({
            createdAt: -1
          });


      res.status(200).json(
        assistants
      );

    } catch (error) {

      console.log(
        "Admin assistants error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load assistants."

      });

    }

  }
);


// ==================================================
// ADMIN VERIFY / UNVERIFY ASSISTANT
// ==================================================

app.patch(
  "/admin/assistants/:id/verify",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


      const assistant =
        await AssistantProfile.findById(
          req.params.id
        );


      if (!assistant) {

        return res.status(404).json({

          message:
            "Assistant profile not found."

        });

      }


      const verified =
        req.body.verified === true;


      assistant.verified =
        verified;


      await assistant.save();


      res.status(200).json({

        message:
          verified
            ? "Assistant verified successfully."
            : "Assistant verification removed.",

        assistant

      });

    } catch (error) {

      console.log(
        "Admin assistant verification error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to update assistant verification."

      });

    }

  }
);


// ==================================================
// ADMIN JOBS
// ==================================================

app.get(
  "/admin/jobs",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


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
        "Admin jobs error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load jobs."

      });

    }

  }
);


// ==================================================
// ADMIN APPLICATIONS
// ==================================================

app.get(
  "/admin/applications",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


      const applications =
        await Application.find()
          .sort({
            createdAt: -1
          });


      res.status(200).json(
        applications
      );

    } catch (error) {

      console.log(
        "Admin applications error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load applications."

      });

    }

  }
);


// ==================================================
// ADMIN HIRES
// ==================================================

app.get(
  "/admin/hires",
  async (req, res) => {

    try {

      const adminEmail =
        req.query.email;


      if (!adminEmail) {

        return res.status(400).json({

          message:
            "Admin email is required."

        });

      }


      const admin =
        await User.findOne({

          email:
            adminEmail.toLowerCase(),

          role:
            "admin"

        });


      if (!admin) {

        return res.status(403).json({

          message:
            "Admin access denied."

        });

      }


      const hires =
        await Hire.find()
          .sort({
            createdAt: -1
          });


      res.status(200).json(
        hires
      );

    } catch (error) {

      console.log(
        "Admin hires error:",
        error.message
      );

      res.status(500).json({

        message:
          "Failed to load hires."

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
