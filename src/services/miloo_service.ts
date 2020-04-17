import RedisRepo from '../repositories/base/redis_repository';
import axios from 'axios';
import { Covid19Data } from 'src/typings/common';

export default class MilooService {
    public static async getCovid19Data(cached: boolean = true): Promise<Covid19Data> {
        const redisRepo = new RedisRepo('general');

        let covidData: any;
        if (cached) {
            covidData = await redisRepo.findOne('covid');
        }

        if (!covidData) {
            const { data: payload } = await axios.get('https://miloo-phoenix.firebaseio.com/covid-19.json');
            covidData = payload;
            redisRepo.create('covid', covidData, 100);
        }

        return covidData;
    }
}
