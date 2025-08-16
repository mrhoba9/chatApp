import User from "../models/User.js";
import Chat from "../models/Chat.js";
import handleSendErrors from "../utils/handleSendErrors.js";
import Message from "../models/Message.js";

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

        if (!sender) {
            return handleSendErrors("Sender user not found", false, 404, next);
        }
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
        handleSendErrors(error || "Internal server error", false, 500, next);
    }
}

// GET /api/friends/receive
export const incomingRequests = async (req, res, next) => {
    try {
        const userPublicKey = req.user.publicKey;
        const user = await User.findOne({ publicKey: userPublicKey});
        if (!user) {
            return handleSendErrors("User not found", false, 404, next);
        }
        res.json({ success: true, incomingRequests: user.incomingRequests.map(req => req.publicKey)});
    } catch (error) {
        handleSendErrors(error || "Internal server error", false, 500, next);
    }
}

// POST /api/friends/approve ## comming back later for creating chat also
export const approveRequest = async (req, res, next) => {
    try {
        const userPublicKey = req.user.publicKey;
        const { userApprovedPublicKey } = req.body;

        const user = await User.findOne({ publicKey: userPublicKey});
        const approvedUser = await User.findOne({ publicKey: userApprovedPublicKey});

        if (!user || !approvedUser) {
            return handleSendErrors("User not found", false, 400, next);
        }

        const requestExists = user.incomingRequests.some(req => req.publicKey === userApprovedPublicKey);
        if (!requestExists) {
            return handleSendErrors("Friend request not found", false, 400, next);
        }

        const alreadyFriends = user.friends.some(f => f.publicKey === userApprovedPublicKey);
        if (alreadyFriends) {
            return res.json({ message: "Already friends", success: true });
        }

        user.friends.push({ publicKey: userApprovedPublicKey });
        approvedUser.friends.push({ publicKey: userPublicKey });

        user.incomingRequests = user.incomingRequests.filter(req => req.publicKey !== userApprovedPublicKey);

        approvedUser.outgoingRequests = approvedUser.outgoingRequests.filter(req => req.publicKey !== userPublicKey);

        await user.save();
        await approvedUser.save();

        let chat = await Chat.findOne({
            participants: { $all: [userPublicKey, userApprovedPublicKey] }
        });

        if(!chat){
            chat = new Chat({
                participants: [userPublicKey, userApprovedPublicKey],
            });
            await chat.save();
        }

        return res.json({ message: "Friend request approved", success: true });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// POST /api/friends/reject
export const rejectRequest = async (req, res, next) => {
    try {
        const userPublicKey = req.user.publicKey;
        const { userRejectedPublicKey } = req.body;

        const user = await User.findOne({ publicKey: userPublicKey});
        const rejectedUser = await User.findOne({ publicKey: userRejectedPublicKey});

        if (!user || !rejectedUser) {
            return handleSendErrors("User not found", false, 400, next);
        }

        const requestExists = user.incomingRequests.some(req => req.publicKey === userRejectedPublicKey);
        if (!requestExists) {
            return handleSendErrors("Friend request not found", false, 400, next);
        }

        const alreadyFriends = user.friends.some(f => f.publicKey === userRejectedPublicKey);
        if (alreadyFriends) {
            return res.json({ message: "Already friends", success: true });
        }

        user.incomingRequests = user.incomingRequests.filter(req => req.publicKey !== userRejectedPublicKey);
        rejectedUser.outgoingRequests = rejectedUser.outgoingRequests.filter(req => req.publicKey !== userPublicKey);

        await user.save();
        await rejectedUser.save();

        return res.json({ message: "Friend request rejected", success: true });

    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// GET /api/friends/list
export const listFriends = async (req, res, next) => {
    try {
        const userPublicKey = req.user.publicKey;
        const user = await User.findOne({ publicKey: userPublicKey});
        if(!user) return handleSendErrors("User not found", false, 400, next);
        res.json({ success: true, friends: user.friends.map(fr => fr.publicKey) });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}

// POST /api/friends/unfriend  ## comming back later for deleting chat also
export const removeFriend = async (req, res, next) => {
    try {
        const userPublicKey = req.user.publicKey;
        const { friendPublicKey } = req.body;

        const user = await User.findOne({ publicKey: userPublicKey });
        const removeFriendUser = await User.findOne({ publicKey: friendPublicKey });

        if (!user || !removeFriendUser) {
            return handleSendErrors("User not found", false, 400, next);
        }

        const alreadyFriends = user.friends.some(f => f.publicKey === friendPublicKey);
        if (!alreadyFriends) {
            return res.json({ message: "You are not friends", success: true });
        }

        user.friends = user.friends.filter(f => f.publicKey !== friendPublicKey);
        removeFriendUser.friends = removeFriendUser.friends.filter(f => f.publicKey !== userPublicKey);

        await user.save();
        await removeFriendUser.save();

        const chat = await Chat.findOne({
            participants: { $all: [userPublicKey, friendPublicKey]}
        })
        if(chat){
            await Message.deleteMany({ chatId: chat.chatId});
            await Chat.deleteOne({ chatId: chat.chatId});
        }

        return res.json({ message: "Friend removed successfully", success: true });
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}