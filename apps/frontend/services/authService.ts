export default class AuthService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async register(credentials: RegisterDto): Promise<any> {

        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...credentials }),
            });

            if (!response.ok) throw new Error('Failed to register');

            return;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials: LoginDto): Promise<any> {

        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...credentials }),
            });

            if (!response.ok) throw new Error('Failed to login');

            const tokens = await response.json() as Tokens;

            const authStore = useAuthStore();
            authStore.setAccessToken(tokens.accessToken);

            localStorage.setItem('refreshToken', tokens.refreshToken);

            return;
        } catch (error) {
            throw error;
        }
    }

    async refreshTokens(): Promise<any> {

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await fetch(`${this.API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                },
            });

            const tokens = await response.json() as Tokens;
            const authStore = useAuthStore();
            authStore.setAccessToken(tokens.accessToken);

            localStorage.setItem('refreshToken', tokens.refreshToken);

            return true;
        } catch (error) {
            throw error;
        }
    }

    async confirmAccount(confirmationId: string): Promise<any> {
        try {
            const response = await fetch(`${this.API_URL}/auth/confirm-account/${confirmationId}`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to confirm account');

            return;
        } catch (error) {
            throw error;
        }
    }

}

type RegisterDto = {
    email: string;
    password: string;
    nickName: string;
};

type LoginDto = {
    email: string;
    password: string;
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};
