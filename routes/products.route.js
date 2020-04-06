const router = require("express").Router();
const verify = require("./verifyToken");
const Product = require('../models/Products');
const Cart  = require('../models/Cart');
const moment = require('moment');

router.get("/description/:id", async (req, res) => {
    const identifier = req.cookies.identifier;
    const cart = await Cart.find({identify: identifier});
    const product = await Product.findOne({_id: req.params.id});
    res.render('products/productDescription', {isLoggedIn: true, product: product, cartItems: cart});
});

router.get("/:id/buynow", verify, (req, res) => {
    
});

router.get("/findProducts", async (req,res) => {    
    const searchProduct = req.query.search;
    await Product.find({product_name: {$regex: ".*" + searchProduct + ".*", $options: 'i'}}, function(err, data){
        return res.status(200).json({result: data})
    });
});

router.get("/search", async (req,res) => {
    const searchProduct = req.query.search;
    await Product.find({description: {$regex: ".*" + searchProduct + ".*", $options: 'i'}}, function(err, data){
        return res.status(200).json({result: data})
    });
});

router.get("/cart", verify, async (req, res) => {
    
    // Identifier is used to check current user and display his cart items only.
    const identifier = req.cookies.identifier;
    const cart = await Cart.find({identify: identifier});
    
    const list = cart.map(async cartItem => {
        const p = await Product.findOne({_id: cartItem.product_id});
        cartItem.product = p;
        return cartItem;
    });

    const l = await Promise.all(list);

    if(!req.cookies.accessToken){
        return res.render("products/cart", { isLoggedIn: false, cartItems: cart});    
    }
    res.render("products/cart", { isLoggedIn: true, cartItems: cart});
});

router.post("/addToCart", verify, async(req, res) => {
    const product_id = req.body.product;
    const identifier = req.cookies.identifier;

    const addItemToCart = new Cart({
        identify: identifier,
        product_id: product_id,
        date: moment().format('L')
    });

    try{
        await addItemToCart.save();
        console.log('Item saved !');
    } catch(err) {
        console.error(`Error is : ${err}`);
    }

    res.redirect("/");
});

router.post("/checkout", async (req,res) => {
    var val = [];
    val.push(req.body.cartItem);
    console.log(req.body.pid);
    const arr = [].concat.apply([], val);;
    arr.forEach(id => {
        var ids = id.split('/');
        console.log(ids);
    }); 
    
    res.redirect('/product/cart');
});

router.get("/cart/edit/:id", verify, async (req, res) => {
    const id = req.params.id;
    const identifier = req.cookies.identifier;
    const cart = await Cart.find({identify: identifier});

    const list = cart.map(async cartItem => {
        const p = await Product.findOne({_id: cartItem.product_id});
        cartItem.product = p;
        return cartItem;
    });

    const l = await Promise.all(list);

    res.render("products/cartEdit", {isLoggedIn: true, id: id, cartItems: cart});
});

router.get("/cart/edit/confirm/:id", async(req,res) => {
    const id = req.params.id;
    const value = req.query.qty;
    console.log('Value ',value);
    await Cart.findByIdAndUpdate(id, {quantity: value}, (err, data) => {
        if(err) console.log(`Error : ${err}`);
        console.log(data);
    });
    res.redirect("/product/cart");
});

router.get("/cart/remove/:id", async (req,res) => {
    const id = req.params.id;
    await Cart.findByIdAndDelete(id,(err, data) => {
        if(err) console.log(`Error : ${err}`);
        console.log(`Product removed from cart : ${data}`);
    });
    res.redirect("/product/cart");
});

module.exports = router;