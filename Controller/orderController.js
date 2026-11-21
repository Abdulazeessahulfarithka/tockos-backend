import Order from "../Model/Order.js"
import Food from "../Model/Food.js"
import Restaurant from "../Model/Resturant.js"

export const placeOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, paymentMethod } = req.body
        if (!restaurantId || !items?.length || !deliveryAddress)
            return res.status(400).json({ success: false, message: "Missing order details" })

        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant || !restaurant.isOpen)
            return res.status(400).json({ success: false, message: "Restaurant unavailable" })

        // prices always come from the DB
        const foods = await Food.find({
            _id: { $in: items.map((i) => i.foodId) },
            restaurant: restaurantId,
            isAvailable: true,
        })
        const foodMap = new Map(foods.map((f) => [f._id.toString(), f]))

        let totalAmount = 0
        const orderItems = []
        for (const { foodId, qty } of items) {
            const food = foodMap.get(foodId)
            if (!food || !Number.isInteger(qty) || qty < 1)
                return res.status(400).json({ success: false, message: "Invalid item in order" })
            totalAmount += food.price * qty
            orderItems.push({ food: food._id, name: food.name, price: food.price, qty })
        }

        const order = await Order.create({
            user: req.userId, restaurant: restaurantId, items: orderItems,
            totalAmount, deliveryAddress, paymentMethod,
        })
        res.status(201).json(order)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("restaurant", "name image")
            .sort("-createdAt")
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const getRestaurantOrders = async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.restaurantId)
        if (!r) return res.status(404).json({ success: false, message: "Restaurant not found" })
        if (r.owner.toString() !== req.userId && req.user.role !== "admin")
            return res.status(403).json({ success: false, message: "Forbidden" })

        res.status(200).json(
            await Order.find({ restaurant: r._id }).populate("user", "name email").sort("-createdAt")
        )
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("restaurant")
        if (!order) return res.status(404).json({ success: false, message: "Order not found" })
        if (order.restaurant.owner.toString() !== req.userId && req.user.role !== "admin")
            return res.status(403).json({ success: false, message: "Forbidden" })

        const allowed = ["accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]
        if (!allowed.includes(req.body.status))
            return res.status(400).json({ success: false, message: "Invalid status" })

        order.status = req.body.status
        await order.save()
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.userId })
        if (!order) return res.status(404).json({ success: false, message: "Order not found" })
        if (order.status !== "placed")
            return res.status(400).json({ success: false, message: "Order can no longer be cancelled" })
        order.status = "cancelled"
        await order.save()
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}