import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../module/User.js';
import { upload } from '../middleware/multerSetup.js';
import { body, validationResult } from 'express-validator';
import {loginLimiter} from '../middleware/loginLimit.js'

const router = Router();

const cookies = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
function generateToken(user) {
    const accessToken = jwt.sign(
        { sub: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { sub: user._id.toString() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken }
}

router.post('/signup',
    body('email').isEmail().normalizeEmail(),
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number and one symbol"),
    upload.single('avatar'),
    async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const { username, email, password, role } = req.body;

        if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid credentials' });
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

        const { accessToken, refreshToken } = generateToken(user);

        res.cookie('refreshToken', refreshToken)
        res.status(201).json({
            accessToken,
            user: {
                id: saved._id,
                username: saved.username,
                email: saved.email,
                role: saved.role,
                avatar: saved.avatar,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const { accessToken, refreshToken } = generateToken(saved);

        res.cookie('refreshToken', refreshToken)

        res.json({
            accessToken,
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

router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'no refresh token' });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const accessToken = jwt.sign(
            { sub: payload.sub, role: payload.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.json({ accessToken });
    } catch (err){
        res.clearCookie('refreshToken');
        res.status(403).json({ message: 'Invalid or expired token, please log in again' })
    }
});

router.post('/logout', (req, res) =>{
    res.clearCookie('refreshToken', cookies)
    res.message('succesfull logout')
})

export default router;