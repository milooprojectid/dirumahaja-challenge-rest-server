import axios from 'axios';
import { User } from 'src/typings/models';

interface Data {
    user: User;
}

export default async ({ data }: { data: Data }): Promise<void> => {
    try {
        const slackWebhook = String(process.env.SLACK_WEBHOOK_URL);
        await axios.post(slackWebhook, {
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
