import { Router } from 'express';
import Location from '../module/Location.js';
import Wall from '../module/Wall.js';
import {ifAdmin} from "../middleware/onlyAdmin.js";
const router = Router();

router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.json(location);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id/walls', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });
        const walls = await Wall.find({ location: req.params.id });
        res.json(walls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const location = new Location(req.body);
        const saved = await location.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', ifAdmin, async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;