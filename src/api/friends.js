import API from "./index.js";

// send request
export async function outgoingRequest(receiverPublicKey){
    const res = await API.post("/friends/request", { receiverPublicKey });
    return res.data;
}

// get request
export async function incomingRequests(){
    const res = await API.get("/friends/receive");
    return res.data;
}

// accept request
export async function approveRequest(userApprovedPublicKey){
    const res = await API.post("/friends/approve", { userApprovedPublicKey });
    return res.data;
}

// reject request
export async function rejectRequest(userRejectedPublicKey){
    const res = await API.post("/friends/reject", { userRejectedPublicKey });
    return res.data;
}

// reject request
export async function listFriends(){
    const res = await API.get("/friends/list");
    return res.data;
}

// remove friend
export async function removeFriend(friendPublicKey){
    const res = await API.post("/friends/unfriend", { friendPublicKey });
    return res.data;
}

