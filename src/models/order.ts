import mongoose, { mongo } from "mongoose";

const cartItemsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  menuItemId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  deliveryDetails: {
    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    addressLine1: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },

  cartItems: [cartItemsSchema],

  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outOfDelivery", "delivered"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
