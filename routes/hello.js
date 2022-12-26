const express = require("express");
const router = express.Router();

router.get("/hello", async (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

module.exports = router;
