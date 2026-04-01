'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

// ===== CART STORE =====
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size = null, color = null) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.id === product.id && item.size === size && item.color === color
        );
        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
          toast.success('Cart updated! 🛒');
        } else {
          set({ items: [...items, { ...product, quantity, size, color, cartId: `${product.id || product._id}-${size}-${color}-${Date.now()}` }] });
          toast.success('Added to cart! 🛒');
        }
      },

      removeItem: (cartId) => {
        set({ items: get().items.filter(item => item.cartId !== cartId) });
        toast.success('Removed from cart');
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) return;
        set({ items: get().items.map(item => item.cartId === cartId ? { ...item, quantity } : item) });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get totalItems() { return get().items.reduce((acc, item) => acc + item.quantity, 0); },
      get totalPrice() { return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0); },
    }),
    { name: 're-cart', storage: createJSONStorage(() => localStorage) }
  )
);

// ===== WISHLIST STORE =====
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const id = product._id || product.id;
        const exists = get().items.some(item => (item._id || item.id) === id);
        if (exists) {
          set({ items: get().items.filter(item => (item._id || item.id) !== id) });
          toast.success('Removed from wishlist 💔');
        } else {
          set({ items: [...get().items, product] });
          toast.success('Added to wishlist ❤️');
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => (item._id || item.id) !== id) });
      },

      isWishlisted: (id) => get().items.some(item => (item._id || item.id) === id),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 're-wishlist', storage: createJSONStorage(() => localStorage) }
  )
);

// ===== AUTH STORE =====
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Login failed');
          set({ user: data.user, token: data.token });
          toast.success('Welcome back! 🎉');
          return { success: true, user: data.user };
        } catch (err) {
          toast.error(err.message);
          return { success: false, error: err.message };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'signup', name, email, password, phone }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Signup failed');
          set({ user: data.user, token: data.token });
          toast.success('Account created! Welcome 🎉');
          return { success: true };
        } catch (err) {
          toast.error(err.message);
          return { success: false, error: err.message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
        set({ user: null, token: null });
        toast.success('Logged out');
      },

      isAdmin: () => get().user?.role === 'admin',
      isLoggedIn: () => !!get().user,
    }),
    { name: 're-auth', storage: createJSONStorage(() => localStorage) }
  )
);
