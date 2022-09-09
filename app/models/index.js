const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.nft = require("./nft.model.js")(sequelize, Sequelize);
db.traits_value = require("./traits_value.model.js")(sequelize, Sequelize);
db.traits = require("./traits.model.js")(sequelize, Sequelize);
db.rarity_score = require("./rarity_score.model.js")(sequelize, Sequelize);
db.nft_total_score = require("./nft_total_score.model.js")(sequelize, Sequelize);

module.exports = db;