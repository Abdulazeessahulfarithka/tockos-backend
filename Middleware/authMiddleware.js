import jwt from "jsonwebtoken"
import User from "../Model/User.js"

export const protect = async (req, res, next) => {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ success: false, message: "Not authorized" })
    try {
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select("-password")
        if (!req.user) return res.status(401).json({ success: false, message: "User not found" })
        req.userId = req.user._id.toString()
        next()
    } catch {
        res.status(401).json({ success: false, message: "Invalid token" })
    }
}

export const authorize = (...roles) => (req, res, next) =>
    roles.includes(req.user.role)
        ? next()
        : res.status(403).json({ success: false, message: "Forbidden" })