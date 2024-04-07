const mongoose = require("mongoose");

// defining a schema

const querySchema = new mongoose.Schema({
  queryTitle: {
    type: String,
    required: [true, "title missing"],
  },
  queryDesc: {
    type: String,
    required: [true, "Description missing"],
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Not assigned",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// create a model
module.exports = mongoose.model("Query", querySchema, "querys");
