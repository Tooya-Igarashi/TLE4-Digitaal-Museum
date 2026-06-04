import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
        premium: { type: Boolean, default: false },
        avatar: { type: String, default: null },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
        participatingEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
        hostedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);