import { create } from "zustand";

interface ThemeState {
    theme: "light" | "dark";
    setTheme: () => void;
}

// Initialize theme from localStorage or system preference
const getInitialTheme = (): "light" | "dark" => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

const useTheme = create<ThemeState>((set, get) => ({
    theme: getInitialTheme(),
    setTheme: () => {
        const _theme = get().theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", _theme);
        set({ theme: _theme });
    },
}));

export default useTheme;
