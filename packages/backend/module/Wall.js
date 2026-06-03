import mongoose from 'mongoose';

const wallSchema = new mongoose.Schema(
    {
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true,
        },
        hasRoute: {
            type: Boolean,
            default: false,
        },
        coordinates: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        wallName: {
            type: String,
            required: true,
            trim: true,
        },
        cityName: {
            type: String,
            required: true,
            trim: true,
        },
        isLegal: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Wall', wallSchema);