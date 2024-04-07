const mongoose = require("mongoose");

// defining a schema

const leaveSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: [true, "reason missing"],
  },
  appliedOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Waiting for Approval",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// create a model
module.exports = mongoose.model("Leave", leaveSchema, "leaves");