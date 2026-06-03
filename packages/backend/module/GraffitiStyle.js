import mongoose from 'mongoose';

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

export default mongoose.model('GraffitiStyle', graffitiStyleSchema);
