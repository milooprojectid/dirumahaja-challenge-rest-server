const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const emblems = [
            {
                id: '1',
                code: 'HERO_ONE',
                name: 'PahlawanLevel1',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/hero_one.png'
            },
            {
                id: '2',
                code: 'HERO_TWO',
                name: 'PahlawanLevel2',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/hero_two.png'
            },
            {
                id: '3',
                code: 'WARRIOR_PANDEMI',
                name: 'WarriorPandemi',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/warrior_pandemi.png'
            },
            {
                id: '4',
                code: 'KUCING_AJA_KALAH',
                name: 'KucingAjaKalah',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/kucing_aja_kalah.png'
            },
            {
                id: '5',
                code: 'PRINCESS_WABAH',
                name: 'PrincessWabah',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/princess_wabah.png'
            },
            {
                id: '6',
                code: 'AQUA_VIRUS',
                name: 'AquaVirus',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/aqua_virus.png'
            },
            {
                id: '7',
                code: 'INFLUENCER',
                name: 'InFLUencer',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/influencer.png'
            },
            {
                id: '8',
                code: 'CORONA_HERO',
                name: 'CoronaHero',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/corona_hero.png'
            },
        ];

        const datas = emblems.map(item => ({
            id: uuid(),
            ...item,
            created_at: new Date(),
            updated_at: new Date()
        }));

        return queryInterface.bulkInsert('emblems', datas, {});
    },
    down: (queryInterface, Sequelize) => { }
};
