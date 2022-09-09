module.exports = app => {
  const nft = require("../controllers/nft.controller.js");

  var router = require("express").Router();

  router.get("/", nft.findAll);

  router.get("/:id", nft.findOne);

  router.get("/fetch/:offset/:sortBy", nft.fetch);

  router.get("/search/:search/:sortBy", nft.search);

  app.use('/api/nft', router);
};