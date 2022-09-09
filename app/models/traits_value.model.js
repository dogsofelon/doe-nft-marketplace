module.exports = (sequelize, Sequelize) => {
    const traits_value = sequelize.define("traits_value", {
      nft_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      trait_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      value : {
        type: Sequelize.STRING
      }
      }, 
      { tableName: 'traits_value',
        timestamps: false
    });
  
    return traits_value;

  };