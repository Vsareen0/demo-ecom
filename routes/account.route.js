const router = require("express").Router();
const verify = require("./verifyToken");

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
  res.clearCookie("accessToken").send("Logged Out !");
});

router.get("/profile/login", verify, (req, res) => {
  const user = res.app.settings['globals'].user;
  res.render('account/profileLogin', {isLoggedIn: true, user: user});
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
