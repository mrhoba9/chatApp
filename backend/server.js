import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import friends from "./routes/friends.js";
import messages from "./routes/messages.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
await connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("../dist")));
app.use(cookieParser());
app.use(logger);


app.use("/api/auth", authRouter);
app.use("/api/friends", friends);
app.use("/api/message", messages);



// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
})

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))