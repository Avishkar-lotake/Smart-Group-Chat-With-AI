import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    try {

        let token = null;

        // ✅ 1. Check Cookie Token
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // ✅ 2. Check Authorization Header (Bearer TOKEN)
        else if (req.headers?.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // ✅ 3. If No Token Found
        if (!token) {
            return res.status(401).json({ error: "Unauthorized User" });
        }

        // ✅ 4. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ 5. Attach User To Request
        req.user = decoded;

        // ✅ 6. Continue Request
        next();

    } catch (error) {

        // ⭐ Token Expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token Expired" });
        }

        // ⭐ Invalid Token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid Token" });
        }

        console.log("Auth Error:", error);

        return res.status(401).json({ error: "Unauthorized User" });
    }
};
