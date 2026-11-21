import express from "express"
import {
    placeOrder,
    getMyOrders,
    cancelOrder,
    getRestaurantOrders,
    updateOrderStatus,
} from "../Controller/orderController.js"
import { protect, authorize } from "../Middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, placeOrder)
router.get("/my", protect, getMyOrders)
router.put("/:id/cancel", protect, cancelOrder)

router.get("/restaurant/:restaurantId", protect, authorize("owner", "admin"), getRestaurantOrders)
router.put("/:id/status", protect, authorize("owner", "admin"), updateOrderStatus)

export default router