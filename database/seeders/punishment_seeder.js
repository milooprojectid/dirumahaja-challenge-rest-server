const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const puns = [
            {
                id: '1',
                text: 'Jawab 1 pertanyaan truth dari penantang mu',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_01.png'
            },
            {
                id: '2',
                text: 'Post foto selfie memalukan di IG kamu dan katakan kamu kalah tantangan',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_02.png'
            },
            {
                id: '3',
                text: 'Post video memalukan di IG kamu dan katakan kamu kalah tantangan',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_03.png'
            },
            {
                id: '4',
                text: 'Lakukan 1 aksi dare dari penantang mu',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_04.png'
            },
            {
                id: '5',
                text: 'Kirim donasi mengenai covid19 dan post buktinya di socmed kamu',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_05.png'
            },
            {
                id: '6',
                text: 'Kirim makanan untuk penantang mu',
                name: '-',
                img_url: 'https://dirumahaja.miloo.id/assets/img/punishment/punishment_06.png'
            },
        ];

        const datas = puns.map(item => ({
            id: uuid(),
            ...item,
            created_at: new Date(),
            updated_at: new Date()
        }));

        return queryInterface.bulkInsert('punishments', datas, {});
    },
    down: (queryInterface, Sequelize) => { }
};
