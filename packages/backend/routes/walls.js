import { Router } from 'express';
import Wall from '../module/Wall.js';
import {ifAdmin} from "../middleware/onlyAdmin.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const walls = await Wall.find().populate('location', 'regionName');
        res.json(walls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/filter/legal', async (req, res) => {
    try {
        const walls = await Wall.find({ isLegal: true }).populate('location', 'regionName');
        res.json(walls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/city/:cityName', async (req, res) => {
    try {
        const walls = await Wall.find({ cityName: req.params.cityName }).populate('location', 'regionName');
        res.json(walls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const wall = await Wall.findById(req.params.id).populate('location', 'regionName');
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        res.json(wall);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const wall = new Wall(req.body);
        const saved = await wall.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const wall = await Wall.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        res.json(wall);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', ifAdmin, async (req, res) => {
    try {
        const wall = await Wall.findByIdAndDelete(req.params.id);
        if (!wall) return res.status(404).json({ message: 'Wall not found' });
        res.json({ message: 'Wall deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;