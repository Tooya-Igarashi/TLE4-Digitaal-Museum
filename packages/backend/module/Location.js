import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
    { regionName: { type: String, required: true, trim: true } },
    { timestamps: true }
);

export default mongoose.model('Location', locationSchema);