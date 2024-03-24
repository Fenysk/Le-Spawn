import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

const LOGIN_ROUTE = '/bienvenue';
const HOME_ROUTE = '/';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const user = authStore.getUser();

    if (!user) {
        return navigateTo(LOGIN_ROUTE);
    }


    if (user.roles && user.roles.includes('ADMIN')) {
        return true;
    }

    return navigateTo(HOME_ROUTE);
});
