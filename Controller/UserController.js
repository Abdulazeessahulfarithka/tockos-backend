import User from "../Model/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "All fields are required" })

        if (await User.findOne({ email }))
            return res.status(409).json({ success: false, message: "Email already registered" })

        const hashed = await bcrypt.hash(password, 10)
        // never allow "admin" from the request
        const safeRole = role === "owner" ? "owner" : "user"
        const user = await User.create({ name, email, password: hashed, role: safeRole })

        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ success: false, message: "Invalid credentials" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}