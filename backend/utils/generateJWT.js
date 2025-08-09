import jwt from "jsonwebtoken";

export default function generateJWT(publicKey){
    const payload = { publicKey };

    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: "1h", issuer: "mrhoba9"};

    return jwt.sign(payload, secretKey, options)
}