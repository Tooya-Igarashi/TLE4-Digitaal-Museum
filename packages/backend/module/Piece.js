import mongoose from 'mongoose';

const pieceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wall',
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    graffitiStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GraffitiStyle',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Piece', pieceSchema);
