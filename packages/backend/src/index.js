import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import userRoute from "../routes/userRoute.js";
import wallSeeder from "../seeders/wallSeeder.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Accept'],
}));

app.use("/users", userRoute);
app.use("/seed/walls", wallSeeder);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});