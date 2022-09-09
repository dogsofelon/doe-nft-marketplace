module.exports = (sequelize, Sequelize) => {
    const rarity_score = sequelize.define("rarity_score", {
      nft_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      trait_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      score : {
        type: Sequelize.FLOAT
      },
      quantity : {
        type: Sequelize.INTEGER
      },
      }, 
      { tableName: 'rarity_score',
        timestamps: false
    });
  
    return rarity_score;

  };