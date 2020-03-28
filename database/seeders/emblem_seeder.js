const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const emblems = [
            {
                code: 'HERO_ONE',
                name: 'PahlawanLevel1',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/hero_one.png'
            },
            {
                code: 'HERO_TWO',
                name: 'PahlawanLevel2',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/hero_two.png'
            },
            {
                code: 'WARRIOR_PANDEMI',
                name: 'WarriorPandemi',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/warrior_pandemi.png'
            },
            {
                code: 'KUCING_AJA_KALAH',
                name: 'KucingAjaKalah',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/kucing_aja_kalah.png'
            },
            {
                code: 'PRINCESS_WABAH',
                name: 'PrincessWabah',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/princess_wabah.png'
            },
            {
                code: 'AQUA_VIRUS',
                name: 'AquaVirus',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/aqua_virus.png'
            },
            {
                code: 'INFLUENCER',
                name: 'InFLUencer',
                img_url: 'https://dirumahaja.miloo.id/assets/img/emblem/influencer.png'
            },
            {
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
