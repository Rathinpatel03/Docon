const express = require("express");
const router = express.Router();
const RazorPayController = require("../controllers/RazorPayController");

router.post("/create_order", RazorPayController.createOrder);
router.post("/verify_order", RazorPayController.verifyOrder);

module.exports = router;