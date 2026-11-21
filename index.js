import "dotenv/config"
import express from "express"
import cors from "cors"
import db from "./Config/db.js"
import userRoute from "./Route/UserRoute.js"
import restaurantRoute from "./Route/restaurantRoutes.js"
import foodRoute from "./Route/foodRoutes.js"
import orderRoute from "./Route/orderRoutes.js"

const app = express()

// middleware
app.use(cors())
app.use(express.json())

// test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "server is running successfully"
    })
})

// database
db()

// api
app.use("/api/user", userRoute)
app.use("/api/restaurant", restaurantRoute)
app.use("/api/food", foodRoute)
app.use("/api/order", orderRoute)

// 404 + error handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ success: false, message: "Server error" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})