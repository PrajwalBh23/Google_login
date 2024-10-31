const express = require("express");
const { update_details, get_details } = require("../controllers/controller.js");
const { isAuthenticated } = require("../controllers/auth.js");

const router = express.Router();

router.get('/get_details', isAuthenticated, get_details);
router.post('/profile', isAuthenticated, update_details);

module.exports =  router;