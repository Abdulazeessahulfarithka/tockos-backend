import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: String,
        cuisine: [String],
        address: { type: String, required: true },
        image: String,
        isOpen: { type: Boolean, default: true },
        rating: { type: Number, default: 0 },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

export default mongoose.model("Restaurant", restaurantSchema)