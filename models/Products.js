const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productsSchema = new Schema({
    brand: String,
    description: String,
    discounted_price: String,
    image: String,
    pid: String,
    product_category_tree: String,
    product_name: String,
    product_rating: String,
    product_specifications: String,
    retail_price: String
});

var Products = mongoose.model('Products',productsSchema);

exports.module = Products;



