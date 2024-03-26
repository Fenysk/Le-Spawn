export default class UsersService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async getMyProfile(): Promise<any> {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/users/my-profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) throw await response.json();

            const user = await response.json();
            authStore.setUser(user);

            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateMyProfile(data: any): Promise<any> {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/users/update/my-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw await response.json();

            const user = await response.json();
            authStore.setUser(user);

            return user;
        } catch (error) {
            throw error;
        }
    }

}
