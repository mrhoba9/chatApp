import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const chatSchema = new mongoose.Schema(
	{
		chatId: { type: String, default: uuidv4, unique: true }, // random unique ID
		participants: [{ type: String, required: true }], // publicKeys of 2 users
	},
	{ timestamps: true }
);

export default mongoose.model("Chat", chatSchema);