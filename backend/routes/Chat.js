const express = require("express");
const router = express.Router();

const { SendMessage, GetMessages } = require("../controller/Chat");

router.post("/send", SendMessage);
router.get("/messages/:withUser", GetMessages);

module.exports = router;