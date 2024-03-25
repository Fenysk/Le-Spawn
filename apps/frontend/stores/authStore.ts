import UsersService from "~/services/usersService"

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const loading = ref<boolean>(false)
    const usersService = new UsersService();

    const setLoading = (value: boolean) => {
        loading.value = value
    }

    const setUser = (newUser: User | null) => {
        user.value = newUser
    }

    const getUser = () => {
        if (!user.value) fetchUser()

        return user.value
    }

    const fetchUser = async () => {
        const user = await usersService.getMyProfile();
        setUser(user);
    }

    const setAccessToken = async (token: string | null) => {
        accessToken.value = token
    }

    const getAccessToken = () => {
        return accessToken.value
    }

    return {
        loading: computed(() => loading.value),
        setLoading,
        setUser,
        getUser,
        setAccessToken,
        getAccessToken
    }
})

export type User = {
    id: string;
    email: string;
    roles: string[];
    defaultCustomerAddressId: string | null;
    defaultSellerAddressId: string | null;
    createdAt: string;
    updatedAt: string;
    Addresses: any[];
    Profile: {
        nickName: string | null;
        avatarUrl: string | null;
        biography: string | null;
        socialLinks: string[];
        userId: string;
        createdAt: string;
        updatedAt: string;
    },
    PersonalInformation: {
        firstName: string | null;
        lastName: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
    }
}
