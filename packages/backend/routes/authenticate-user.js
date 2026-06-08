import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../module/User.js';
import { upload } from '../middleware/multerSetup.js';

const router = Router();

router.post('/signup', upload.single('avatar'), async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields: username, email, password' });
    }

    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) return res.status(409).json({ message: 'Username or email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            avatar: req.file ? `/uploads/${req.file.filename}` : null,
        });

        const saved = await user.save();
        res.status(201).json({
            id: saved._id,
            username: saved.username,
            email: saved.email,
            role: saved.role,
            avatar: saved.avatar,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;