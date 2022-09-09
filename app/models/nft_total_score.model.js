module.exports = (sequelize, Sequelize) => {
    const nft_total_score = sequelize.define("nft_total_score", {
      nft_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      total_score : {
        type: Sequelize.FLOAT
      }
      }, 
      { tableName: 'nft_total_score',
        timestamps: false
    });
  
    return nft_total_score;

  };