import User from "../models/User.js";
import handleSendErrors from "../utils/handleSendErrors.js";

// POST /api/friends/request 
export const outgoingRequest = async (req, res, next) => {
    try {
        const senderPublicKey = req.user.publicKey;
        const { receiverPublicKey } = req.body;

        if(senderPublicKey === receiverPublicKey){
            return handleSendErrors("You cannot send a friend request to yourself.", false, 400, next);
        }

        // Get both users
        const sender = await User.findOne({ publicKey: senderPublicKey });
        const receiver = await User.findOne({ publicKey: receiverPublicKey})

        if(!receiver){
            return handleSendErrors("friend not found.", false, 400, next);
        }

        // Check if already friends
        if(sender.friends.some(f => f.publicKey === receiverPublicKey)){
            return handleSendErrors("You are already friends.", false, 400, next);
        }

        // Check if request already sent
        if(sender.outgoingRequests.some(r => r.publicKey === receiverPublicKey)){
            return handleSendErrors("Friend request already sent.", false, 400, next);
        }

        // Update sender (add outgoing request)
        sender.outgoingRequests.push({ publicKey: receiverPublicKey});
        await sender.save();

        // Update receiver (add incoming request if not already there)
        receiver.incomingRequests.push({ publicKey: senderPublicKey});
        await receiver.save();

        return res.status(200).json({ message: "Friend request sent successfully." });

    } catch (error) {
        handleSendErrors(error.name || "Internal server error", false, 500, next);
    }
}