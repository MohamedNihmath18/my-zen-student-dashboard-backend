const mongoose = require("mongoose");

// defining a schema

const capstoneSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Zen class student dashboard",
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    default: "Waiting for review",
  },
  score: {
    type: String,
    default: "Waiting for review",
  },
  status: {
    type: String,
    default: "submitted",
  },
  frontEndUrl: {
    type: String,
    required: [true, "FE URL missing"],
  },
  backEndUrl: {
    type: String,
    required: [true, "BE URL missing"],
  },
  frontEndCode: {
    type: String,
    required: [true, "FE Code URL missing"],
  },
  backEndCode: {
    type: String,
    required: [true, "BE Code URL missing"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// create a model
module.exports = mongoose.model("Capstone", capstoneSchema, "capstones");
