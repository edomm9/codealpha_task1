const mongoose = require("mongoose");
const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", Schema);
module.exports = Product;
