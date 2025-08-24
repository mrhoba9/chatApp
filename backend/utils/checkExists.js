import jwt from "jsonwebtoken";

export default function checkExists(req) {
    try {
        const token = req.cookies?.token;
        if (!token) return false;

        jwt.verify(token, process.env.JWT_SECRET); 
        return true;
    } catch {
        return false;
    }
}