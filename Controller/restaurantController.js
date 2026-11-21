import Restaurant from "../Model/Resturant.js"

const canManage = (r, req) => r.owner.toString() === req.userId || req.user.role === "admin"

export const getRestaurants = async (req, res) => {
    try {
        const { search, cuisine } = req.query
        const filter = {}
        if (search) filter.name = { $regex: search, $options: "i" }
        if (cuisine) filter.cuisine = cuisine
        res.status(200).json(await Restaurant.find(filter).sort("-rating"))
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const getRestaurantById = async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.id)
        if (!r) return res.status(404).json({ success: false, message: "Restaurant not found" })
        res.status(200).json(r)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const createRestaurant = async (req, res) => {
    try {
        const { name, description, cuisine, address, image } = req.body
        const r = await Restaurant.create({ name, description, cuisine, address, image, owner: req.userId })
        res.status(201).json(r)
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export const updateRestaurant = async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.id)
        if (!r) return res.status(404).json({ success: false, message: "Restaurant not found" })
        if (!canManage(r, req)) return res.status(403).json({ success: false, message: "Forbidden" })

        const { name, description, cuisine, address, image, isOpen } = req.body
        Object.assign(r, { name, description, cuisine, address, image, isOpen })
        res.status(200).json(await r.save())
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

export const deleteRestaurant = async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.id)
        if (!r) return res.status(404).json({ success: false, message: "Restaurant not found" })
        if (!canManage(r, req)) return res.status(403).json({ success: false, message: "Forbidden" })
        await r.deleteOne()
        res.status(200).json({ success: true, message: "Restaurant deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}