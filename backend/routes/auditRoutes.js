const express = require("express");
const router = express.Router();

const { auditPage } = require("../controllers/auditController");

router.post("/audit", auditPage);

module.exports = router;