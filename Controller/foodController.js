import Food from "../Model/Food.js"
import Restaurant from "../Model/Resturant.js"

const canManage = async (restaurantId, req) => {
    const r = await Restaurant.findById(restaurantId)
    return r && (r.owner.toString() === req.userId || req.user.role === "admin")
}

export const getFoodsByRestaurant = async (req, res) => {
    try {
        res.status(200).json(await Food.find({ restaurant: req.params.restaurantId }))
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const addFood = async (req, res) => {
    try {
        if (!(await canManage(req.params.restaurantId, req)))
            return res.status(403).json({ success: false, message: "Forbidden" })

        const { name, description, price, category, image, isVeg } = req.body
        const food = await Food.create({
            restaurant: req.params.restaurantId, name, description, price, category, image, isVeg,
        })
        res.status(201).json(food)
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export const updateFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
        if (!food) return res.status(404).json({ success: false, message: "Food not found" })
        if (!(await canManage(food.restaurant, req)))
            return res.status(403).json({ success: false, message: "Forbidden" })

        const { name, description, price, category, image, isVeg, isAvailable } = req.body
        Object.assign(food, { name, description, price, category, image, isVeg, isAvailable })
        res.status(200).json(await food.save())
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
        if (!food) return res.status(404).json({ success: false, message: "Food not found" })
        if (!(await canManage(food.restaurant, req)))
            return res.status(403).json({ success: false, message: "Forbidden" })
        await food.deleteOne()
        res.status(200).json({ success: true, message: "Food deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}