'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let articles=[];
    for(let i=0;i<1000;i++){
      let obj={
        title: 'John',
        imageUrl: 'example@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        description:'qsdqsdqsddddddddddd',
        content:"qsdsqdqsdqsdqsdsdsq",
        userId:1
        
      };
      articles.push(obj);
    }
    

    return queryInterface.bulkInsert('Articles',articles);
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('Articles', null, {});
     
  }
};
