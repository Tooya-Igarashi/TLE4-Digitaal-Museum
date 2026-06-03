// routes/user.js
const express = require('express');
const router = express.Router();
const User = require("../module/User.js");

// GET /users/:id/profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')           // exclude sensitive fields
            .populate({
                path: 'favorites',           // resolve Piece ObjectIds
                populate: {
                    path: 'wall',              // nested: also resolve the Wall inside each Piece
                    select: 'cityName isLegal coordinates'
                }
            })
            .populate('participatingEvents', 'eventName');  // only return eventName

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;