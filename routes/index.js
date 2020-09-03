const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "It's working lol" }).status(200);
});

module.exports = router;
