import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        items: [
            {
                food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
                name: String,
                price: Number,
                qty: { type: Number, min: 1 },
            },
        ],
        totalAmount: { type: Number, required: true },
        deliveryAddress: { type: String, required: true },
        paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
        status: {
            type: String,
            enum: ["placed", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"],
            default: "placed",
        },
    },
    { timestamps: true }
)

export default mongoose.model("Order", orderSchema)