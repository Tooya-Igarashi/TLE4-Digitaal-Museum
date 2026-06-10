import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import wallsRouter from "./routes/walls.js";
import piecesRouter from "./routes/pieces.js";
import eventsRouter from "./routes/events.js";
import locationsRouter from "./routes/locations.js";
import graffitiStylesRouter from "./routes/graffitiStyles.js";
import seeder from "./seeders/seeder.js";
import validateApiKey from "./middleware/apiKeyAuth.js";
import authRouter from "./routes/authenticate-user.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Accept", "Content-Type", "x-api-key"],
  }),
);

app.use(validateApiKey);

app.use("/users", usersRouter);
app.use("/walls", wallsRouter);
app.use("/pieces", piecesRouter);
app.use("/events", eventsRouter);
app.use("/locations", locationsRouter);
app.use("/graffiti-styles", graffitiStylesRouter);
app.use("/seed", seeder);
app.use("/auth", authRouter);

// Temporary simple connect as requested: ignore other connection logic
console.log("Attempting MongoDB connection using MONGODB_URI from .env");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB verbonden!"))
  .catch((err) => console.log("Fout:", err));

const port = process.env.EXPRESS_PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
