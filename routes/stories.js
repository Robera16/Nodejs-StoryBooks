const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/story");

// @desc show add page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  // ensureGuest -> if the user is authenticated it shows dashboard else login page
  res.render("stories/add");
});

module.exports = router;
