const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail:{
        type: String,
        required: true
    },
    customerAddress:{
        type: String,
        required: true
    },
    customerNumber:{
        type: Number,
        required: true
    },
    products: [
     {
        type: String,
        required: true
      },

    ],
   
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema);
module.exports = order;