var mongoose = require('mongoose');
const moment = require('moment');

var Cart = new mongoose.Schema({
    identify: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    product: {
        type: Object
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{collection: 'cart'});

module.exports = mongoose.model('Cart', Cart);