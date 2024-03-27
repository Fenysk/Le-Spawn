export default class AnalyzeService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async analyzeGamePhotosWithAnthropicHaiku(language: string = 'french', photos: string[]) {
        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/analyze/photos/game/anthropic-haiku`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ language, photos }),
            });

            if (!response.ok) throw await response.json();

            const content = await response.json();

            return content;
        } catch (error) {
            throw error;
        }
    }


}
