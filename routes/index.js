const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");

// @desc Login/Landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  // ensureGuest -> if the user is authenticated it shows dashboard else login page
  res.render("login", { layout: "login" });
});

// @desc Dashboard
// @route GET / dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  // ensureAuth -> if the user is not authenticated login else dashboard page
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("/error/500");
  }
});

module.exports = router;
