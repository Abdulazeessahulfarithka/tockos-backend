import express from "express"
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} from "../Controller/restaurantController.js"
import { getFoodsByRestaurant, addFood } from "../Controller/foodController.js"
import { protect, authorize } from "../Middleware/authMiddleware.js"

const router = express.Router()

router.get("/", getRestaurants)
router.get("/:id", getRestaurantById)
router.post("/", protect, authorize("owner", "admin"), createRestaurant)
router.put("/:id", protect, authorize("owner", "admin"), updateRestaurant)
router.delete("/:id", protect, authorize("owner", "admin"), deleteRestaurant)

router.get("/:restaurantId/foods", getFoodsByRestaurant)
router.post("/:restaurantId/foods", protect, authorize("owner", "admin"), addFood)

export default router