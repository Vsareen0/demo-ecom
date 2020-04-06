var mongoose = require('mongoose');

var Orders = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    identify: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},{collection: 'Orders'});




