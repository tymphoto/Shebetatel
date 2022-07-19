module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', [
      {
        image: '/images/2022-06-22T07:51:02.635Z-amsterdam.jpeg',
        text: 'Лучший город для жизни! Квартал красных фонарей в особенности',
        user_id: 1,
      },
      {
        image: '/images/2022-06-22T07:51:46.179Z-apls.jpeg',
        text: 'Что может быть лучше гор? Только горы!',
        user_id: 2,
      },
      {
        image: '/images/2022-06-22T07:51:58.782Z-bali.jpeg',
        text: 'На чиле, на расслабоне',
        user_id: 4,
      },
      {
        image: '/images/2022-06-22T07:52:08.446Z-london.jpeg',
        text: 'Good morning!',
        user_id: 3,
      },
      {
        image: '/images/2022-06-22T07:51:24.035Z-maldives.jpeg',
        text: 'На чиле, на расслабоне part 2',
        user_id: 4,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
