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

router.get("/findProducts", async (req,res) => {    
    const searchProduct = req.query.search;
    await Product.find({product_name: {$regex: ".*" + searchProduct + ".*", $options: 'i'}}, function(err, data){
        return res.status(200).json({result: data})
    });
});


module.exports = router;