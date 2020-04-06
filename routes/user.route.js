const router = require("express").Router();
const Product = require('../models/Products');
const Cart = require('../models/Cart');

router.get("/", async (req, res) => {
  const products = await Product.find({});

  if(!req.cookies.accessToken){
    return res.render('users/index', {isLoggedIn: false, products: products, cartItems: []}); 
  }
  const identifier = req.cookies.identifier;
  const cart = await Cart.find({identify: identifier});  
  res.render("users/index", {isLoggedIn: true, products: products, cartItems: cart});
});


module.exports = router;
