module.exports = (sequelize, Sequelize) => {
    const traits = sequelize.define("traits", {
      trait_id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      trait_label : {
        type: Sequelize.STRING
      }
      }, 
      { tableName: 'traits',
        timestamps: false
    });
  
    return traits;

  };