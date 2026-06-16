import { Router } from 'express';
import Event from '../module/Event.js';
import User from '../module/User.js';
import {ifAdmin} from "../middleware/onlyAdmin.js";
const router = Router();

router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('host', 'username email')
            .populate('participants', 'username');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('host', 'username email')
            .populate('participants', 'username email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        const saved = await event.save();
        await User.findByIdAndUpdate(req.body.host, { $push: { hostedEvents: saved._id } });
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/:id/join/:userId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (event.participants.includes(req.params.userId)) {
            return res.status(400).json({ message: 'User already participating' });
        }
        event.participants.push(req.params.userId);
        await event.save();
        user.participatingEvents.push(req.params.id);
        await user.save();
        res.status(201).json({ message: 'User joined event' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id/leave/:userId', ifAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        event.participants = event.participants.filter((id) => id.toString() !== req.params.userId);
        await event.save();
        user.participatingEvents = user.participatingEvents.filter((id) => id.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'User left event' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await User.updateMany({ participatingEvents: req.params.id }, { $pull: { participatingEvents: req.params.id } });
        await User.updateMany({ hostedEvents: req.params.id }, { $pull: { hostedEvents: req.params.id } });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;