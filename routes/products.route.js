const router = require("express").Router();
const verify = require("./verifyToken");
const Product = require('../models/Products'); 

router.get("/description/:id", async (req, res) => {
    const product = await Product.findOne({_id: req.params.id});
    res.render('products/productDescription', {isLoggedIn: true, product: product});
});

router.get("/:id/addToCart", (req, res) => {
    
});

router.get("/:id/buynow", verify, (req, res) => {
    
});

module.exports = router;