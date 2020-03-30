const router = require("express").Router();
const Product = require('../models/Products');

router.get("/", async (req, res) => {
  const products = await Product.find({});
  if(!req.cookies.accessToken) return res.render('users/index', {isLoggedIn: false, user: null, products: products}); 
  res.render("users/index", {isLoggedIn: true, products: products});
});


module.exports = router;
