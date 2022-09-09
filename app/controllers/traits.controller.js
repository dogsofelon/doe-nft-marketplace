const db = require("../models");
const traits = db.traits;

exports.findAll = (req, res) => {
	traits.findAll(
    { 
      order: [['trait_id', 'asc']],
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving nfts."
      });
    });
};

exports.findOne = (req, res) => {
	traits.findAll({
    where: {
      trait_id: req.params.id
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving trait."
    });
  });
};