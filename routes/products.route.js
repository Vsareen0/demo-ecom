const router = require("express").Router();
const verify = require("./verifyToken");
const Product = require('../models/Products');
const Cart  = require('../models/Cart');
const Orders = require('../models/Orders');
const moment = require('moment');

router.get("/description/:id", async (req, res) => {
    const identifier = req.cookies.identifier;
    const cart = await Cart.find({identify: identifier});
    const product = await Product.findOne({_id: req.params.id});
    res.render('products/productDescription', {isLoggedIn: true, product: product, cartItems: cart});
});

router.get("/buy/:id", verify, async (req, res) => {
    let id = req.params.id;
    const cartItem = await Cart.find({_id: id});
        var p_id = cartItem[0].product_id;
        var qty = cartItem[0].quantity;
        var identifier = cartItem[0].identify;
        var price = cartItem[0].price; 

        var newOrder = new Orders({
            product_id: p_id,
            quantity: qty,
            identify: identifier,
            price: price
        });

        try {
            await newOrder.save();
            await Cart.findByIdAndDelete({_id: id});
            console.log('Saved order !',p_id);
        }catch(err) {
            console.log(`Error : ${err}`);
        }

        res.redirect("/product/orderHistory");
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

router.get("/orderHistory", verify, async(req, res) => {
    // Identifier is used to check current user and display his cart items only.
    const identifier = req.cookies.identifier;
    const orders = await Orders.find({identify: identifier});
    const cart = await Cart.find({identify: identifier});

    const list = orders.map(async item => {
        const p = await Product.findOne({_id: item.product_id});
        item.product = p;
        return item;
    });

    const l = await Promise.all(list);

    if(!req.cookies.accessToken){
        return res.render("products/orderHistory", { isLoggedIn: false, cartItems: cart, orders: orders});    
    }
    res.render("products/orderHistory", { isLoggedIn: true, cartItems: cart, orders: orders});
});

router.post("/addToCart", verify, async(req, res) => {
    const product_id = req.body.product;
    const identifier = req.cookies.identifier;

    const product = await Product.find({_id: product_id});

    const addItemToCart = new Cart({
        identify: identifier,
        product_id: product_id,
        price: product[0].discounted_price,
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
    
    const arr = [].concat.apply([], val);;
    arr.forEach(async id => {
        const cartItem = await Cart.find({_id: id});
        var p_id = cartItem[0].product_id;
        var qty = cartItem[0].quantity;
        var identifier = cartItem[0].identify;
        var price = cartItem[0].price; 

        var newOrder = new Orders({
            product_id: p_id,
            quantity: qty,
            identify: identifier,
            price: price
        });

        try {
            await newOrder.save();
            await Cart.findByIdAndDelete({_id: id});
            console.log('Saved order !',p_id);
        }catch(err) {
            console.log(`Error : ${err}`);
        }
    }); 
    
    res.redirect('/product/orderHistory');
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