const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Lets validate the data before send in to db
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).render('account/login',{error: error.details[0].message});

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).render('account/login',{error: "Email is not found"});

  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).render('account/login',{error: "Invalid Password"});

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.cookie("accessToken", token, { maxAge: 1800000 });
  res.app.settings['globals'].user = user;
  res.render('users/index', {isLoggedIn: true, userDetails: user});
});

module.exports = router;
