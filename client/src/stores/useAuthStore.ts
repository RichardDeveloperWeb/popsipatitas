import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { ref } from 'vue'
import { computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  permissions: string[]
  roles: string[]
}

export const useAuthStore = defineStore('auth', () => {
  // --- STATUS ---
  const user = ref<User | null> (null);
  const api = useApi();

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value)

  // --- ACTIONS ---

  /**
   * Obtiene el usuario actual desde Laravel
   */
  async function fetchUser() {
    try {
      const response = await api.get('/user');
      user.value = response.data;
    } catch (error) {
      user.value = null
      throw error
    }
  }

  /**
   * Hidratación: Solo pide el usuario si no existe y hay cookie
   */
  async function ensureUser() {
    try {
      if (!user.value)
        await fetchUser();
    } catch (e) {
    }
    return user.value
  }

  /**
   * Flujo de Login completo
   */
  async function login(credentials: any) {
    try {
      await api.get('/sanctum/csrf-cookie', {
        baseURL: 'http://localhost/'
      });
      await api.post('/login', credentials);
      await fetchUser();
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  async function register(credentials: any) {
    try {
      await api.get('/sanctum/csrf-cookie', {
        baseURL: 'http://localhost/'
      });
      await api.post('/register', credentials);
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  /**
   * Logout
   */
  async function logout() {
    try {
      await api.post('/logout');
      user.value = null
    } catch (e) {
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    ensureUser
  }
})