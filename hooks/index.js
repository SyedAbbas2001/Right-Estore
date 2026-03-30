'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '@/utils/helpers';

// Debounced search hook
export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, debouncedQuery };
}

// Window size hook
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// Scroll position hook
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrollY;
}

// Local storage hook
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue];
}

// Intersection observer hook for animations
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.once !== false) observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// Product filters hook
export function useProductFilters() {
  const [filters, setFilters] = useState({
    category: null,
    priceRange: [0, 10000],
    sizes: [],
    genders: [],
    sort: 'featured',
    search: '',
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: null,
      priceRange: [0, 10000],
      sizes: [],
      genders: [],
      sort: 'featured',
      search: '',
    });
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  }, []);

  return { filters, updateFilter, resetFilters, toggleArrayFilter };
}

// Toast hook (wrapper around react-hot-toast)
export function useNotify() {
  const notify = {
    success: (msg) => {
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => toast.success(msg));
      }
    },
    error: (msg) => {
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => toast.error(msg));
      }
    },
  };
  return notify;
}
