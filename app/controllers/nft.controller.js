const db = require("../models");
const nft = db.nft;
const traits_value = db.traits_value;
const rarity_score = db.rarity_score;
const nft_total_score = db.nft_total_score;
const { Op } = require("sequelize");

nft.hasMany(traits_value, {foreignKey: 'nft_id'});
nft.hasMany(rarity_score, {foreignKey: 'nft_id'});
nft.hasOne(nft_total_score, {foreignKey: 'nft_id'});

traits_value.belongsTo(nft, {foreignKey: 'nft_id'});
rarity_score.belongsTo(nft, {foreignKey: 'nft_id'});
nft_total_score.belongsTo(nft, {foreignKey: 'nft_id'});

function getOrderBy(param){
  if(param == 1){
    return [['nft_id', 'asc']];
  } else if(param == 2) {
    return [['nft_id', 'desc']];
  } else if(param == 3) {
    return [['nft_total_score', 'total_score', 'asc'], ['nft_id', 'asc']];
  } else if(param == 4) {
    return [['nft_total_score', 'total_score', 'desc'], ['nft_id', 'asc']];
  } 
}

// Retrieve all NFTs from the database.
exports.findAll = (req, res) => {
	nft.findAll(
    { 
      order: [['nft_id', 'asc']],
      include: {all: true}
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

exports.fetch = (req, res) => {
  nft.findAll({
    limit: req.params.offset,
    include: [{
      model: traits_value, as: "traits_value",
      model: rarity_score, as: "rarity_score",
      model: nft_total_score, as: "nft_total_score"
    }],
    order: getOrderBy(req.params.sortBy),
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

exports.search = (req, res) => {
  nft.findAll({
    include: [{
      model: traits_value, as: "traits_value",
      model: rarity_score, as: "rarity_score",
      model: nft_total_score, as: "nft_total_score"
    }],
    where: {
      nft_name: {
        [Op.eq]: '#'+req.params.search
      }
    },
    order: getOrderBy(req.params.sortBy),
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

// Find a single NFT with an id
exports.findOne = (req, res) => {
	const id = req.params.id;
	nft.findAll({
    include: {all: true},
    where: {
      nft_id: req.params.id
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving nft."
    });
  });
};
