module.exports = (sequelize, Sequelize) => {
  const nft = sequelize.define("nft", {
    nft_id: {
      type: Sequelize.INTEGER,
	  primaryKey: true
    },
	  nft_name: {
      type: Sequelize.STRING
    },
    nft_description: {
      type: Sequelize.STRING
    },
    nft_img: {
      type: Sequelize.STRING
    }
  }, 
  { tableName: 'nft',
    timestamps: false
  });

  return nft;

};