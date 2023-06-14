const mongoose  = require('mongoose');

const schema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  name: {
    type: String,
    required: true
  },
  long_desc: {
    type: String,
    required: true
  },
  short_desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('product', schema);
