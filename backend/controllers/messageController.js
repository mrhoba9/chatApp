import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import handleSendErrors from "../utils/handleSendErrors.js";
import sanitizeHtml from "sanitize-html"; 
import { getIO } from "../socket/index.js";

// POST /api/message/send
export const sendMessage = async (req, res, next) => {
    try {
        const userpk = req.user.publicKey;
        const { respk, message } = req.body;

        if (!respk) {
            return handleSendErrors("Receiver public key required", false, 400, next);
        }
        if (!message || !message.trim()) {
            return handleSendErrors("Message cannot be empty", false, 400, next);
        }
        // 2. Sanitize message
        const cleanMessage = sanitizeHtml(message.trim(), {
            allowedTags: [],
            allowedAttributes: {},
        });

        const chat = await Chat.findOne({
            participants: { $all: [userpk, respk] }
        });

        if (!chat) {
            return handleSendErrors("No chat exists between these users", false, 404, next);
        }

        const newMessage = new Message({
            chatId: chat.chatId,
            sender: userpk,
            text: cleanMessage,
        });
        await newMessage.save();

        // 🔔 Emit via Socket.IO
        const io = getIO();
        io.to(userpk).emit("message_sent", newMessage);
        io.to(respk).emit("receive_message", newMessage);

        return res.json({ success: true, message: newMessage });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// POST /api/message/get
export const getMessage = async (req, res, next) => {
    try {
        const userpk = req.user.publicKey;
        const { respk } = req.body;

        if (!respk) {
            return handleSendErrors("Receiver public key required", false, 400, next);
        }
        const chat = await Chat.findOne({
            participants: { $all: [userpk, respk] }
        });
        if (!chat) {
            return handleSendErrors("No chat exists between these users", false, 404, next);
        }
        const messages = await Message.find({chatId: chat.chatId}).sort({ createdAt: 1});
        return res.json({ success: true, messages });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}