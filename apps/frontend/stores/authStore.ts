export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const loading = ref<boolean>(false)

    const setLoading = (value: boolean) => {
        loading.value = value
    }

    const setUser = (newUser: User) => {
        user.value = newUser
    }

    const getUser = () => {
        return user.value
    }

    const setAccessToken = (token: string) => {
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
