module.exports = app => {
    const traits = require("../controllers/traits.controller.js");
    var router = require("express").Router();
    router.get("/", traits.findAll);
    router.get("/:id", traits.findOne);
    app.use('/api/traits', router);
  };