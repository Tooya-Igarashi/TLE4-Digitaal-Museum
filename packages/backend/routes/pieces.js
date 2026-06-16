import { Router } from 'express';
import Piece from '../module/Piece.js';
import { upload } from "../middleware/multerSetup.js";
import {authenticateJWT} from "../middleware/jwtSetup.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const pieces = await Piece.find()
            .populate('user', 'username')
            .populate('wall', 'cityName regionName isLegal coordinates')
            .populate('graffitiStyle', 'graffitiStyleName');
        res.json(pieces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/wall/:wallId', async (req, res) => {
    try {
        const pieces = await Piece.find({ wall: req.params.wallId })
            .populate('user', 'username')
            .populate('graffitiStyle', 'graffitiStyleName');
        res.json(pieces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const pieces = await Piece.find({ user: req.params.userId })
            .populate('wall', 'cityName regionName isLegal')
            .populate('graffitiStyle', 'graffitiStyleName');
        res.json(pieces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id)
            .populate('user', 'username email')
            .populate({ path: 'wall', populate: { path: 'location', select: 'regionName' } })
            .populate('graffitiStyle', 'graffitiStyleName');
        if (!piece) return res.status(404).json({ message: 'Piece not found' });
        res.json(piece);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('image'), authenticateJWT, async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const piece = new Piece({
            ...req.body,
            image: imagePath,
        });
        const saved = await piece.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', upload.single('image'), authenticateJWT, async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const piece = await Piece.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!piece) return res.status(404).json({ message: 'Piece not found' });
        res.json(piece);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) return res.status(404).json({ message: 'Piece not found' });

        if (piece.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await piece.deleteOne();
        res.json({ message: 'Piece deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;