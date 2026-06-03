import express from 'express';
import mongoose from 'mongoose';
import {faker} from "@faker-js/faker/locale/nl";
import Wall from '../module/Wall.js';

const router = express.Router();

router.post("/", async (req, res, next) => {
    if (req.body?.method && req.body.method === "SEED") {

        const walls = [];
        await Wall.deleteMany({});

        const amount = req.body?.amount ?? 0;

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

    } else {
        next();
    }
});

export default router;