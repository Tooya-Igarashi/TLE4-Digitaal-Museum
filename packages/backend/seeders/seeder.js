import express from 'express';
import mongoose from 'mongoose';
import {faker} from '@faker-js/faker';
import Wall from '../module/Wall.js';
import Piece from '../module/Piece.js';
import User from '../module/User.js';

const router = express.Router();

// POST /seed/walls
router.post("/walls", async (req, res) => {
    const walls = [];
    await Wall.deleteMany({});

    const amount = req.body?.amount ?? 10;

    for (let i = 0; i < amount; i++) {
        const wall = new Wall({
            wallName: faker.location.street(),
            cityName: faker.location.city(),
            description: faker.lorem.paragraph(),
            coordinates: `${faker.location.latitude()}, ${faker.location.longitude()}`,
            isLegal: faker.datatype.boolean(),
            hasRoute: faker.datatype.boolean(),
            location: new mongoose.Types.ObjectId(),
        });

        await wall.save();
        walls.push(wall);
    }

    res.status(201).json(walls);
});

// POST /seed/users
router.post("/users", async (req, res) => {
    const users = [];
    await User.deleteMany({});

    const amount = req.body?.amount ?? 10;

    for (let i = 0; i < amount; i++) {
        const user = new User({
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement(['user', 'admin', 'artist']),
            premium: faker.datatype.boolean(),
            description: faker.lorem.paragraph(),
        });

        await user.save();
        users.push(user);
    }

    res.status(201).json(users);
});

// POST /seed/pieces
router.post("/pieces", async (req, res) => {
    const pieces = [];
    await Piece.deleteMany({});

    const amount = req.body?.amount ?? 10;

    const users = await User.find();
    const walls = await Wall.find();

    if (users.length === 0 || walls.length === 0) {
        return res.status(400).json({message: "Seed users and walls first before seeding pieces!"});
    }

    for (let i = 0; i < amount; i++) {
        const piece = new Piece({
            user: faker.helpers.arrayElement(users)._id,
            wall: faker.helpers.arrayElement(walls)._id,
            image: faker.image.url(),
            description: faker.lorem.paragraph(),
            title: faker.lorem.words(3),
            date: faker.date.past(),
            graffitiStyle: new mongoose.Types.ObjectId(),
        });

        await piece.save();
        pieces.push(piece);
    }

    res.status(201).json(pieces);
});

export default router;