const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const admins = [
            {
                name: 'Archie',
                username: 'archisdi',
                password: bcrypt.hashSync('archisdi')
            },
            {
                name: 'Sukma',
                username: 'sukma',
                password: bcrypt.hashSync('sukma')
            }
        ];

        const datas = admins.map(item => ({
            id: uuid(),
            ...item,
            created_at: new Date(),
            updated_at: new Date()
        }));

        return queryInterface.bulkInsert('admins', datas, {});
    },
    down: (queryInterface, Sequelize) => { }
};
