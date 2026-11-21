import mongoose from "mongoose"

const foodSchema = new mongoose.Schema(
    {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        name: { type: String, required: true, trim: true },
        description: String,
        price: { type: Number, required: true, min: 0 },
        category: String,
        image: String,
        isVeg: { type: Boolean, default: true },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default mongoose.model("Food", foodSchema)