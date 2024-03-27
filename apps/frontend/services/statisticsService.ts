import { AddNewStatisticDto } from "../../backend/src/statistics/dto/addNewStat.dto";
import { GetStatisticDto } from "../../backend/src/statistics/dto/getStat.dto";

export default class StatisticsService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async getAllStatistics() {
        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/statistics`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw await response.json();

            const content = await response.json();

            return content;
        } catch (error) {
            throw error;
        }
    }

    async getSpecificStatistics(data: GetStatisticDto) {
        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        data.userId = !data.userId ? '' : data.userId;

        try {
            const response = await fetch(`${this.API_URL}/statistics/specific?type=${data.type}&userId=${data.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw await response.json();

            const content = await response.json();

            return content;
        } catch (error) {
            throw error;
        }
    }

    async sendNewStatistic(data: AddNewStatisticDto) {
        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        let headers: any = { 'Content-Type': 'application/json' };
        let endPoint = `${this.API_URL}/statistics/anonyme`;

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
            endPoint = `${this.API_URL}/statistics/user`;
        }

        try {
            const response = await fetch(endPoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) throw await response.json();

            const content = await response.json();

            return content;
        } catch (error) {
            throw error;
        }
    }

}
