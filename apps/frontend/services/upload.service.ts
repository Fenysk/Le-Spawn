export default class UploadService {

    private API_URL: string;

    constructor() {
        const config = useRuntimeConfig();
        this.API_URL = config.public.API_URL;
    }

    async uploadImage(image: File) {

        const authStore = useAuthStore();
        const accessToken = authStore.getAccessToken();

        try {
            const formData = new FormData();
            formData.append('file', image);

            const response = await fetch(`${this.API_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) throw await response.json();

            const content = await response.json();

            const fileUrl = content.url;

            return fileUrl;
        } catch (error) {
            throw error;
        }
    };

    async uploadMultipleImages(images: File[]) {
            
            const authStore = useAuthStore();
            const accessToken = authStore.getAccessToken();
    
            try {
                const formData = new FormData();
                images.forEach((image) => {
                    formData.append('files', image);
                });
    
                const response = await fetch(`${this.API_URL}/upload/images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });
    
                if (!response.ok) throw await response.json();
    
                const content = await response.json();
    
                const fileUrls = content.urls;
    
                return fileUrls;
            } catch (error) {
                throw error;
            }
    }

}
