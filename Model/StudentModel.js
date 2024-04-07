const mongoose = require("mongoose");

// defining a schema
const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "please add first name"],
  },
  lastname: {
    type: String,
    required: [true, "please add last name"],
  },
  batch: {
    type: String,
    default: "B54-WD Tamil",
  },
  contactNo: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "please add the email address"],
    unique: [true, "email already taken"],
  },
  password: {
    type: String,
    required: [true, "please add password"],
  },
  resetToken: {
    type: String,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  codeKata: {
    type: String,
    default: "0",
  },
  webKata: {
    type: String,
    default: "0",
  },
  verified: {
    type: Boolean,
    default: true,
  },
  mockInterview: {
    type: String,
    default: "0",
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  leave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
  portfolio: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
    },
  ],
  capstone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capstone",
    },
  ],
  webcode: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webcode",
    },
  ],
  query: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
    },
  ],
  mock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mock",
    },
  ],
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

// create a model
module.exports = mongoose.model("Student", studentSchema, "students");