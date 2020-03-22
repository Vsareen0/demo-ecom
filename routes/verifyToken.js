const express = require("express").Router();
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Access Denied. Please login in order to continue");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
