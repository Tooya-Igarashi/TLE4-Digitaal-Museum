import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../module/User.js";
import Wall from "../module/Wall.js";
import Piece from "../module/Piece.js";
import Event from "../module/Event.js";
import Location from "../module/Location.js";
import GraffitiStyle from "../module/GraffitiStyle.js";

dotenv.config({ path: "./.env" });

const fetchAll = async () => {
  try {
    const ensureDbInUri = (uri, dbName = "digitaal-museum") => {
      if (!uri) return uri;
      const [base, qs] = uri.split("?");
      let clean = base;
      if (clean.endsWith("/")) clean = clean.slice(0, -1);
      if (clean.split("/").length <= 3) {
        clean = `${clean}/${dbName}`;
      }
      return qs ? `${clean}?${qs}` : clean;
    };

    const mongoUri = ensureDbInUri(
      process.env.MONGODB_URI,
      process.env.MONGODB_DB || "digitaal-museum",
    );
    const conn = await mongoose.connect(mongoUri);
    console.log("Verbonden met MongoDB");
    const dbConn = conn.connection;
    try {
      const dbName = dbConn.db.databaseName || conn.name;
      console.log("Connected DB name:", dbName);
      const cols = await dbConn.db.listCollections().toArray();
      console.log(
        "Collections in DB:",
        cols.map((c) => c.name),
      );
    } catch (e) {
      console.warn("Unable to list collections:", e.message);
    }

    const users = await User.find({});
    console.log("Users:", users);

    const walls = await Wall.find({});
    console.log("Walls:", walls);

    const pieces = await Piece.find({});
    console.log("Pieces:", pieces);

    const events = await Event.find({});
    console.log("Events:", events);

    const locations = await Location.find({});
    console.log("Locations:", locations);

    const styles = await GraffitiStyle.find({});
    console.log("GraffitiStyles:", styles);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Fout:", err.message);
    process.exitCode = 1;
  }
};

fetchAll();
