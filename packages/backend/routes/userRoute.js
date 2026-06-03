import express from 'express';
import User from '../module/User.js';

const router = express.Router();

// GET /users/:id/profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate({
                path: 'favorites',
                populate: {
                    path: 'wall',
                    select: 'cityName isLegal coordinates'
                }
            })
            .populate('participatingEvents', 'eventName');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;