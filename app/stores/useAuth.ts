import { Platform } from 'react-native';
import { create } from 'zustand';
import { deriveKey, fromHex, makeSalt, toHex } from '../auth/authCrypto';
import { createUser, getUser } from '../db/authRepo';
// Route-safe import: use lib/ for platform files to avoid expo-router scanning app/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SecureStore = Platform.OS === 'web' ? require('../../lib/utils/secureStore.web') : require('../../lib/utils/secureStore.native');

type AuthState = {
  currentUser: string | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  signup: (username: string, password: string, confirm: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const CURRENT_USER_KEY = 'auth.currentUser';

export const useAuth = create<AuthState>((set) => ({
  currentUser: null,
  loading: false,

  hydrate: async () => {
    const u = await SecureStore.getItemAsync(CURRENT_USER_KEY);
    set({ currentUser: u ?? null });
  },

  signup: async (username, password, confirm) => {
    username = username.trim();
    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (password !== confirm) throw new Error('Passwords must match');
    set({ loading: true });
    const exists = await getUser(username);
    if (exists) { set({ loading: false }); throw new Error('Username already exists'); }
    const salt = makeSalt(16);
    const derived = await deriveKey(password, salt);
    await createUser({
      username,
      password_hash: toHex(derived),
      salt: toHex(salt),
      iters: 120_000,
      created_at: Date.now(),
    });
    await SecureStore.setItemAsync(CURRENT_USER_KEY, username);
    // On user switch, load user-scoped stores
    try {
      const { useSaved } = require('./useSaved');
      const saved = useSaved.getState();
      saved.resetMemoryOnly();
      await saved.loadSaved();
      const { useProgress } = require('./useProgress');
      await useProgress.getState().loadProgress();
    } catch {}
    set({ currentUser: username, loading: false });
  },

  login: async (username, password) => {
    username = username.trim();
    set({ loading: true });
    const u = await getUser(username);
    if (!u) { set({ loading: false }); throw new Error('User not found'); }
    const derived = await deriveKey(password, fromHex(u.salt), u.iters);
    if (toHex(derived) !== u.password_hash) { set({ loading: false }); throw new Error('Invalid credentials'); }
    await SecureStore.setItemAsync(CURRENT_USER_KEY, username);
    // Hydrate user-scoped stores for this user
    try {
      const { useSaved } = require('./useSaved');
      const saved = useSaved.getState();
      saved.resetMemoryOnly();
      await saved.loadSaved();
      const { useProgress } = require('./useProgress');
      await useProgress.getState().loadProgress();
    } catch {}
    set({ currentUser: username, loading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
    // Clear memory caches only; don't delete persisted user data
    try {
      const { useProgress } = require('./useProgress');
      await useProgress.getState().resetAll();
      const { useSaved } = require('./useSaved');
      useSaved.getState().resetMemoryOnly();
    } catch {}
    set({ currentUser: null });
  },
}));


