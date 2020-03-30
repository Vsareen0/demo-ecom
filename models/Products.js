const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    brand: {
        type: String
    },
    description: {
        type: String
    },
    discounted_price: {
        type: String
    },
    image: {
        type: Array
    },
    product_category_tree: {
        type: Array
    },
    product_name: {
        type: String
    },
    product_rating: {
        type: String
    },
    product_specifications: {
        type: Array
    },
    retail_price: {
        type: String
    }
}, {collection: 'sample'});

module.exports = mongoose.model('Product',productsSchema);



