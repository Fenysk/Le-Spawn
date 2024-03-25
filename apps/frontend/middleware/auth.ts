import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import AuthService from '~/services/authService';
import UsersService from '~/services/usersService';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const usersService = new UsersService();
    const authService = new AuthService();
    const loginMode = to.query.login === 'true' ? 'true' : 'false';
    const authStore = useAuthStore();    
    authStore.setLoading(true);

    if (authStore.getAccessToken()) {
        authStore.setLoading(false);
        return true;
    }

    if (!process.client) {
        authStore.setLoading(false);
        return navigateTo(`/bienvenue?login=${loginMode}&redirect=${encodeURIComponent(to.fullPath)}`);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            const isRefreshed = await authService.refreshTokens();
            if (!isRefreshed) throw new Error('Token refresh failed');

            const user = await usersService.getMyProfile();
            authStore.setUser(user);
            return true;
        } catch (error) {
            return navigateTo(`/bienvenue?login=${loginMode}&redirect=${encodeURIComponent(to.fullPath)}`);
        } finally {
            authStore.setLoading(false);
        }
    }

    authStore.setLoading(false);
    return navigateTo(`/bienvenue?login=${loginMode}&redirect=${encodeURIComponent(to.fullPath)}`);
});
