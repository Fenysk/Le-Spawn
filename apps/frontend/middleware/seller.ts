import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

const LOGIN_ROUTE = '/bienvenue';
const BECOME_A_SELLER_ROUTE = '/devenir-vendeur';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const user = authStore.getUser();

    if (!user) {
        return navigateTo(LOGIN_ROUTE);
    }


    if (user.roles && (user.roles.includes('SELLER') || user.roles.includes('ADMIN'))) {
        return true;
    }

    return navigateTo(BECOME_A_SELLER_ROUTE);
});
