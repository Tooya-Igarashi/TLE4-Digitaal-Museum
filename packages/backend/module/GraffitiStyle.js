const mongoose = require('mongoose');

const graffitiStyleSchema = new mongoose.Schema(
  {
    graffitiStyleName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GraffitiStyle', graffitiStyleSchema);
