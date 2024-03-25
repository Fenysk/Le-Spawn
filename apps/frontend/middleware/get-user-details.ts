import { defineNuxtRouteMiddleware } from 'nuxt/app';
import AuthService from '~/services/authService';

export default defineNuxtRouteMiddleware(async (to) => {
    const authService = new AuthService();
    const authStore = useAuthStore();

    const accessToken = authStore.getAccessToken();
    console.log('Access token:', accessToken);
    if (accessToken) return console.log('There is already an access token.');

    const user = await authStore.getUser();
    console.log('User:', user);
    if (user) return console.log('There is already a user profile.');

    if (!process.client) return console.log('There is\'nt a client process.');

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Refresh token:', refreshToken);
        
        if (refreshToken) {
            console.log('Refreshing tokens...');

            const isRefreshed = await authService.refreshTokens();
            console.log('Is refreshed:', isRefreshed);
            
            if (!isRefreshed) return;

            await authStore.getUser();
        }

        authStore.getUser();
    } catch (error) {
        console.error('Failed to refresh token or fetch user profile:', error);
        // En cas d'erreur, vous pouvez décider de déconnecter l'utilisateur, rediriger, ou simplement ignorer l'erreur.
        // authService.logout(); // Exemple de déconnexion.
        // navigateTo('/login'); // Exemple de redirection.
    }
});
