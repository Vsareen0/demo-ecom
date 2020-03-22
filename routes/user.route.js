const router = require("express").Router();

router.get("/", (req, res) => {
  if(!req.cookies.accessToken) return res.render('users/index', {isLoggedIn: false, user: null}); 
  res.render("users/index", {isLoggedIn: true});
});

module.exports = router;
