const router = require("express").Router();
const verify = require("./verifyToken");
const Cart = require('../models/Cart');
const User = require('../models/User');

// Account Login
router.get("/login", (req, res) => {
  if(req.cookies.accessToken) return res.send('Already Logged In');
  res.render('account/login');
});

// Account Register
router.get("/register", (req, res) => {
  res.render("account/register");
});

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/");
});

router.get("/profile/login", verify, async (req, res) => {
  const identifier = req.cookies.identifier;
  const user = await User.find({email: identifier});
  const cart = await Cart.find({identify: identifier});
  res.render('account/profileLogin', {isLoggedIn: true, user: user, cartItems: cart});
});

router.get("/profile/personal", verify, (req, res) => {
  res.send("Access Granted to personal profile");
});

router.get("/order-history", verify, (req, res) => {
  res.send("Access Granted to order history");
});

router.get("/wishlist", verify, (req, res) => {
  res.send("Access Granted to wishlist");
});

module.exports = router;
