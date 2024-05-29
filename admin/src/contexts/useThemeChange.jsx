import React, { createContext, useState, useContext, useEffect } from 'react';

// Créez le contexte avec un nom en majuscule par convention
const ThemeContext = createContext();

// Fournisseur de thème avec un nom descriptif
export function ThemeProvider({ children }) {
    const [themeDark, setThemeDark] = useState(() => {
        // Vérifiez si une valeur existe déjà dans localStorage
        const savedTheme = localStorage.getItem('themeDark');
        return savedTheme !== null ? JSON.parse(savedTheme) : false;
    });

    const toggleDarkMode = (boolean) => {
        setThemeDark(boolean);
        localStorage.setItem('themeDark', JSON.stringify(boolean));
    };

    useEffect(() => {
        // Synchronisez l'état du thème avec localStorage au chargement
        const savedTheme = localStorage.getItem('themeDark');
        if (savedTheme !== null) {
            setThemeDark(JSON.parse(savedTheme));
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ themeDark, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook pour utiliser le contexte de thème
export function useThemeChange() {
    return useContext(ThemeContext);
}
