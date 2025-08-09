import crypto from "crypto";

export function generatePublicKey(){
    return crypto.randomBytes(6).toString("hex");
}
export function generatePrivateKey(){
    return crypto.randomBytes(8).toString("hex");
}