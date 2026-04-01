'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

// Cart Store
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
          set({ items: [...items, { ...product, quantity, size, color, cartId: `${product.id}-${size}-${color}-${Date.now()}` }] });
          toast.success('Added to cart! 🛒');
        }
      },

      removeItem: (cartId) => {
        set({ items: get().items.filter(item => item.cartId !== cartId) });
        toast.success('Removed from cart');
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.cartId === cartId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get totalItems() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'kiddy-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Wishlist Store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some(item => item.id === product.id);
        if (exists) {
          set({ items: get().items.filter(item => item.id !== product.id) });
          toast.success('Removed from wishlist 💔');
        } else {
          set({ items: [...get().items, product] });
          toast.success('Added to wishlist ❤️');
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      isWishlisted: (id) => get().items.some(item => item.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'kiddy-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  toggleSearch: () => set(state => ({ searchOpen: !state.searchOpen })),
  toggleMobileMenu: () => set(state => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeAll: () => set({ searchOpen: false, mobileMenuOpen: false }),
}));
