const mongoose = require("mongoose");

// defining a schema

const portfolioSchema = new mongoose.Schema({
  portfolioURL: {
    type: String,
    required: [true, "Porfolio URL missing"],
  },
  githubURL: {
    type: String,
    required: [true, "Github URL missing"],
  },
  resumeURL: {
    type: String,
    required: [true, "Resume URL missing"],
  },
  reveiwedBy: {
    type: String,
    default: "Not yet reviewed",
  },
  status: {
    type: String,
    default: "Submitted",
  },
  comment: {
    type: String,
    default: "Not yet reviewed",
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// create a model
module.exports = mongoose.model("Portfolio", portfolioSchema, "portfolios");