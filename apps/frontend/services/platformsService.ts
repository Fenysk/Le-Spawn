export default class PlatformsService {

	private API_URL: string;

	constructor() {
		const config = useRuntimeConfig();
		this.API_URL = config.public.API_URL;
	}

	async getAllPlatforms(): Promise<Platform[]> {

		const authStore = useAuthStore();
		const accessToken = authStore.getAccessToken();

		try {
			const response = await fetch(`${this.API_URL}/platforms`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
			});

			if (!response.ok) throw new Error('Failed to fetch platforms');

			const platforms = await response.json();

			return platforms;
		} catch (error) {
			throw error;
		}
	}

	async addNewPlatform(data: any): Promise<void> {

		const authStore = useAuthStore();
		const accessToken = authStore.getAccessToken();

		try {
			const response = await fetch(`${this.API_URL}/platforms`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) throw new Error('Failed to add platform');

			const newPlatform = await response.json();

			return newPlatform;
		} catch (error) {
			throw error;
		}

	}

}

export type Platform = {
	id: string;
	name: string;
	shortName: string;
	generation: number;
	manufacturer: string;
	releaseDate: string;
	squareLogoUrl: string;
	rectangleLogoUrl: string;
	pictureUrl: string;
};
