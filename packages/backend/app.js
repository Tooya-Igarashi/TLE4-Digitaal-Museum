import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import wallsRouter from './routes/walls.js';
import piecesRouter from './routes/pieces.js';
import eventsRouter from './routes/events.js';
import locationsRouter from './routes/locations.js';
import graffitiStylesRouter from './routes/graffitiStyles.js';
import seeder from './seeders/seeder.js';
import validateApiKey from './middleware/apiKeyAuth.js';
import authRouter from './routes/authenticate-user.js';
import cookieParser from 'cookie-parser'
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization', 'x-api-key'],
    credentials: true,
}));

app.use(validateApiKey);

app.use('/users', usersRouter);
app.use('/walls', wallsRouter);
app.use('/pieces', piecesRouter);
app.use('/events', eventsRouter);
app.use('/locations', locationsRouter);
app.use('/graffiti-styles', graffitiStylesRouter);
app.use('/seed', seeder);
app.use('/auth', authRouter);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});