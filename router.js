const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "IT WORKING LOL" }).status(200);
});

module.exports = router;
