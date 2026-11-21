import express from "express"
import { updateFood, deleteFood } from "../Controller/foodController.js"
import { protect, authorize } from "../Middleware/authMiddleware.js"

const router = express.Router()

router.put("/:id", protect, authorize("owner", "admin"), updateFood)
router.delete("/:id", protect, authorize("owner", "admin"), deleteFood)

export default router