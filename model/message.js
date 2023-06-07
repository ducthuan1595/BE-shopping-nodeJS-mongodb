const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    roomId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'room'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", schema);
