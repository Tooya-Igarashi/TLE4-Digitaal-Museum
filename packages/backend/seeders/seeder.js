import express from 'express';
import mongoose from 'mongoose';
import {faker} from '@faker-js/faker';
import Wall from '../module/Wall.js';
import Piece from '../module/Piece.js';
import User from '../module/User.js';
import Location, {locations} from '../module/Location.js';
import GraffitiStyle, {graffitiStyles} from '../module/GraffitiStyle.js';
import {ifAdmin} from "../middleware/onlyAdmin.js";

const router = express.Router();

// POST /seed/locations
router.post("/locations", ifAdmin,async (req, res) => {
    try {
        const saved = await Location.insertMany(locations);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed locations', error: err.message});
    }
});

// POST /seed/walls
router.post("/walls", ifAdmin, async (req, res) => {
    try {
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
                coordinates: "51.48471, 4.42261",
                description: "A tunnel wall in Zevenkamp covered in graffiti art.",
                wallName: "Toy Tunnel Zevenkamp",
                cityName: "Nieuwerkerk aan den IJssel",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.56007, 4.26365",
                description: "A tunnel wall in Overschie covered in graffiti art.",
                wallName: "Tunnel Overschie",
                cityName: "Overschie",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.56137, 4.27068",
                description: "A pump track wall in Rotterdam covered in graffiti art.",
                wallName: "Pump track Rotterdam",
                cityName: "Volkstuinvereniging Eigen Hof",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.56020, 4.29274",
                description: "A wall in Crooswijk covered in graffiti art.",
                wallName: "Croos",
                cityName: "Crooswijk",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.54382, 4.30443",
                description: "A wall at Helderheidsplein in Feijenoord covered in graffiti art.",
                wallName: "Helderheidplein",
                cityName: "Feijenoord",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.54013, 4.30552",
                description: "A corrugated iron wall in Feijenoord covered in graffiti art.",
                wallName: "Golfplaat wall",
                cityName: "Feijenoord",
                isLegal: true,
            },
            {
                location: rotterdam,
                hasRoute: false,
                coordinates: "51.56024, 4.32596",
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
router.post("/users", ifAdmin, async (req, res) => {
    try {
        const users = [];
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
router.post("/graffiti-styles", ifAdmin, async (req, res) => {
    try {
        const saved = await GraffitiStyle.insertMany(graffitiStyles);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Failed to seed graffiti styles', error: err.message});
    }
});

// POST /seed/pieces
router.post("/pieces", ifAdmin, async (req, res) => {
    try {
        const pieces = [];

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
                image: "../public/test-images/graffiti.jpg",
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