import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme :  localStorage.getItem("streamify-theme") || "luxury",
    setTheme: (theme) => {
        localStorage.setItem("streamify-theme", theme);
        set({ theme });
    },
}));