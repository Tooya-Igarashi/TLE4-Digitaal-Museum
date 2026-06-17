import { Router } from 'express';
import GraffitiStyle from '../module/GraffitiStyle.js';
import Piece from '../module/Piece.js';
import {ifAdmin} from "../middleware/onlyAdmin.js";
const router = Router();

router.get('/', async (req, res) => {
    try {
        const styles = await GraffitiStyle.find();
        res.json(styles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const style = await GraffitiStyle.findById(req.params.id);
        if (!style) return res.status(404).json({ message: 'Style not found' });
        res.json(style);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id/pieces', async (req, res) => {
    try {
        const style = await GraffitiStyle.findById(req.params.id);
        if (!style) return res.status(404).json({ message: 'Style not found' });
        const pieces = await Piece.find({ graffitiStyle: req.params.id })
            .populate('user', 'username')
            .populate('wall', 'cityName wallName');
        res.json(pieces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const style = new GraffitiStyle(req.body);
        const saved = await style.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const style = await GraffitiStyle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!style) return res.status(404).json({ message: 'Style not found' });
        res.json(style);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', ifAdmin, async (req, res) => {
    try {
        const style = await GraffitiStyle.findByIdAndDelete(req.params.id);
        if (!style) return res.status(404).json({ message: 'Style not found' });
        res.json({ message: 'Style deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;