import { Router } from 'express';
import User from '../module/User.js';
import Piece from '../module/Piece.js';
import { upload } from "../middleware/multerSetup.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/role/:role', async (req, res) => {
    const validRoles = ['user', 'artist', 'admin'];
    if (!validRoles.includes(req.params.role)) {
        return res.status(400).json({ message: 'Invalid role, must be user or artist' });
    }

    try {
        const users = await User.find({ role: req.params.role }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate({
                path: 'favorites',
                populate: [
                    { path: 'wall', select: 'cityName regionName isLegal coordinates' },
                    { path: 'graffitiStyle', select: 'graffitiStyleName' },
                ],
            })
            .populate('likes', 'title image date')
            .populate('participatingEvents', 'eventName')
            .populate('hostedEvents', 'eventName participants');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'favorites',
            populate: [
                { path: 'wall', select: 'cityName regionName isLegal' },
                { path: 'graffitiStyle', select: 'graffitiStyleName' },
            ],
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/favorites/:pieceId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const piece = await Piece.findById(req.params.pieceId);
        if (!piece) return res.status(404).json({ message: 'Piece not found' });
        if (user.favorites.includes(req.params.pieceId)) {
            return res.status(400).json({ message: 'Piece already in favorites' });
        }
        user.favorites.push(req.params.pieceId);
        await user.save();
        res.status(201).json({ message: 'Added to favorites' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id/favorites/:pieceId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.favorites = user.favorites.filter((id) => id.toString() !== req.params.pieceId);
        await user.save();
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/likes/:pieceId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const piece = await Piece.findById(req.params.pieceId);
        if (!piece) return res.status(404).json({ message: 'Piece not found' });
        if (user.likes.includes(req.params.pieceId)) {
            return res.status(400).json({ message: 'Piece already liked' });
        }
        user.likes.push(req.params.pieceId);
        await user.save();
        res.status(201).json({ message: 'Piece liked' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id/likes/:pieceId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.likes = user.likes.filter((id) => id.toString() !== req.params.pieceId);
        await user.save();
        res.json({ message: 'Piece unliked' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('avatar'), async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const user = new User({
            ...req.body,
            avatar: imagePath,
        });
        const saved = await user.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', upload.single('avatar'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.avatar = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;