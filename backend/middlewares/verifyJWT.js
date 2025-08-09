import jwt from "jsonwebtoken";
import handleSendErrors from "../utils/handleSendErrors";

export default function verifyJWT(req, res, next){
    try {
        const token = req.cookies?.token;
        if(!token) return handleSendErrors("No token provided", false, 401, next);

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey, { issuer: "mrhoba9" });
        console.log(decoded);

        req.username = decoded.username;
        req.publickey = decoded.publickey;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") return handleSendErrors("Invalid or expired token", false, 401, next);
        handleSendErrors("Internal server error", false, 500, next);
    }
}