export default class CollectionsService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async getMyCollections(): Promise<Collection[]> {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/collections/mine`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) throw await response.json();

            const collections = await response.json();

            return collections;
        } catch (error) {
            throw error;
        }
    }

    async getCollectionById(collectionId: string): Promise<Collection> {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/collections/${collectionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) throw await response.json();

            const collection = await response.json();

            return collection;
        } catch (error) {
            throw error;
        }
    }

    async addNewVideoGameToCollection(data: any): Promise<VideoGame> {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const response = await fetch(`${this.API_URL}/video-games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw await response.json();

            const videoGame = await response.json();

            return videoGame;
        } catch (error) {
            throw error;
        }
    }

}

export type Collection = {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    VideoGames: VideoGame[];
};

export type VideoGame = {
    id: string;
    title: string;
    description: string | null;
    edition: string | null;
    region: string | null;
    tags: string[];
    ageRating: number | null;
    editor: string | null;
    developer: string | null;
    realeaseDate: string | null;
    maxMultiplayerLocalPlayers: number | null;
    maxMultiplayerOnlinePlayers: number | null;
    initialPurchasePrice: number | null;
    negotiatedPurchasePrice: number | null;
    estimatedPrice: number | null;
    currency: Currency;
    platformId: string;
    collectionId: string;
    createdAt: string;
    updatedAt: string;
    Box: Box;
    Game: Game;
    extraContents: ExtraContents[];
    Platform: Platform;
};

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

export type Box = {
    stateBox: string;
    photoFrontBox: string;
    photoBackBox: string;
    photoSideBox: string;
    photoInsideBox: string;
    videoGameId: string;
}

export type Game = {
    stateGame: string;
    photoFrontGame: string;
    photoBackGame: string;
    videoGameId: string;
}

export type ExtraContents = {
    id: string;
    name: string;
    type: string;
    state: string;
    videoGameId: string;
};

export enum Currency {
    EUR = 'EUR',
    USD = 'USD'
}
