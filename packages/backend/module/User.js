import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['artist', 'visitor', 'admin'],
      default: 'visitor',
    },
    premium: {
      type: Boolean,
      default: false,
    },
    // Pieces this user has liked
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Piece',
      },
    ],
    // Pieces this user has favorited
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Piece',
      },
    ],
    // Events this user participates in
    participatingEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    // Events this user hosts
    hostedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
