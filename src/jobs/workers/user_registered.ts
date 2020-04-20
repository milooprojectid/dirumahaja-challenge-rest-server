import axios from 'axios';
import UserService from '../../services/user_service';
import UserRepository from '../../repositories/user_repo';
import { UserRegisteredData } from 'src/typings/worker';

export default async ({ data }: { data: UserRegisteredData }): Promise<void> => {
    try {
        const userRepo = new UserRepository();

        /** generate relation */
        if (data.challenger_id && data.challenger_id != data.user.username) {
            const challenger = await userRepo.findOne({ username: data.challenger_id });
            if (challenger) {
                await UserService.pair(data.user, challenger);
            }
        }

        /** send message to slack */
        await axios.post(String(process.env.SLACK_WEBHOOK_URL), {
            fallback: '-',
            text: 'New user registered',
            color: '588da8',
            fields: [
                { title: 'Name', value: data.user.username, short: true },
                { title: 'City', value: data.user.location_name || '-', short: true },
                { title: 'Gender', value: data.user.gender === 'm' ? 'male' : 'female', short: true },
                { title: 'Age', value: data.user.age || '-', short: true }
            ]
        });
    } catch (err) {
        console.error(err.message);
    }
};
