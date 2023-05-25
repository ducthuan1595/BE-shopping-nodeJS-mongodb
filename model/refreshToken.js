const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  refreshToken: [
    {
      type: String,
      required: true
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('refreshToken', schema);
