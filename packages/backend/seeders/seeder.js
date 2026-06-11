import express from 'express';
import mongoose from 'mongoose';
import {faker} from '@faker-js/faker';
import Wall from '../module/Wall.js';
import Piece from '../module/Piece.js';
import User from '../module/User.js';
import Location, {locations} from '../module/Location.js';
import GraffitiStyle, {graffitiStyles} from '../module/GraffitiStyle.js';

const router = express.Router();

// POST /seed/locations
router.post("/locations", async (req, res) => {
    try {
        await Location.deleteMany({});
        const saved = await Location.insertMany(locations);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed locations', error: err.message});
    }
});

// POST /seed/walls
router.post("/walls", async (req, res) => {
    try {
        await Wall.deleteMany({});

        const locationDocs = await Location.find();

        if (locationDocs.length === 0) {
            return res.status(400).json({message: "Seed locations first before seeding walls!"});
        }

        const nieuwerkerk = locationDocs.find(l => l.regionName === "Nieuwerkerk aan den IJssel")._id;
        const rotterdam = locationDocs.find(l => l.regionName === "Rotterdam")._id;

        const walls = [
            {
                location: nieuwerkerk,
                hasRoute: false,
                coordinates: "51°48'47.1\"N 4°42'26.1\"E",
                description: "A tunnel wall in Zevenkamp covered in graffiti art.",
                wallName: "Toy Tunnel Zevenkamp",
                cityName: "Nieuwerkerk aan den IJssel",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°56'00.7\"N 4°26'36.5\"E",
                description: "A tunnel wall in Overschie covered in graffiti art.",
                wallName: "Tunnel Overschie",
                cityName: "Overschie",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°56'13.7\"N 4°27'06.8\"E",
                description: "A pump track wall in Rotterdam covered in graffiti art.",
                wallName: "Pump track Rotterdam",
                cityName: "Volkstuinvereniging Eigen Hof",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°56'02.0\"N 4°29'27.4\"E",
                description: "A wall in Crooswijk covered in graffiti art.",
                wallName: "Croos",
                cityName: "Crooswijk",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°54'38.2\"N 4°30'44.3\"E",
                description: "A wall at Helderheidsplein in Feijenoord covered in graffiti art.",
                wallName: "Helderheidplein",
                cityName: "Feijenoord",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°54'01.3\"N 4°30'55.2\"E",
                description: "A corrugated iron wall in Feijenoord covered in graffiti art.",
                wallName: "Golfplaat wall",
                cityName: "Feijenoord",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51°56'02.4\"N 4°32'59.6\"E",
                description: "A wall in Prinsenland covered in graffiti art.",
                wallName: "Rotterdam Prinsepark",
                cityName: "Prinsenland",
                isLegal: true,
            },
        ];

        const saved = await Wall.insertMany(walls);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed walls', error: err.message});
    }
});

// POST /seed/users
router.post("/users", async (req, res) => {
    try {
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
                biography: faker.lorem.paragraph(),
            });

            await user.save();
            users.push(user);
        }

        res.status(201).json(users);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed users', error: err.message});
    }
});

// POST /seed/graffiti-styles
router.post("/graffiti-styles", async (req, res) => {
    try {
        await GraffitiStyle.deleteMany({});
        const saved = await GraffitiStyle.insertMany(graffitiStyles);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed graffiti styles', error: err.message});
    }
});

// POST /seed/pieces
router.post("/pieces", async (req, res) => {
    try {
        const pieces = [];
        await Piece.deleteMany({});

        const amount = req.body?.amount ?? 10;

        const users = await User.find();
        const walls = await Wall.find();
        const graffitiStyles = await GraffitiStyle.find();

        if (users.length === 0 || walls.length === 0) {
            return res.status(400).json({message: "Seed users and walls first before seeding pieces!"});
        }

        if (graffitiStyles.length === 0) {
            return res.status(400).json({message: "Seed graffiti styles first before seeding pieces!"});
        }

        for (let i = 0; i < amount; i++) {
            const piece = new Piece({
                user: faker.helpers.arrayElement(users)._id,
                wall: faker.helpers.arrayElement(walls)._id,
                image: faker.image.url(),
                description: faker.lorem.paragraph(),
                title: faker.lorem.words(3),
                date: faker.date.past(),
                graffitiStyle: faker.helpers.arrayElement(graffitiStyles)._id,
            });

            await piece.save();
            pieces.push(piece);
        }

        res.status(201).json(pieces);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed pieces', error: err.message});
    }
});

export default router;