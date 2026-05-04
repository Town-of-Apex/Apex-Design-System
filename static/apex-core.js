/**
 * APEX MODERN - CORE LOGIC
 * Handles automatic population of project metadata and Theme Management (Dark/Light)
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- 1. THEME MANAGEMENT ---
    const initTheme = () => {
        const savedTheme = localStorage.getItem('apex-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeToggleUI(theme);
    };

    const updateThemeToggleUI = (theme) => {
        const icons = document.querySelectorAll('.theme-toggle-icon');
        icons.forEach(icon => {
            icon.style.display = icon.getAttribute('data-for') === theme ? 'none' : 'block';
        });
    };

    window.toggleApexTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('apex-theme', newTheme);
        updateThemeToggleUI(newTheme);
    };

    initTheme();

    // --- 2. METADATA POPULATION ---
    if (typeof APEX_CONFIG === 'undefined') return;

    if (APEX_CONFIG.title) {
        document.title = APEX_CONFIG.title;
    }

    const headerTitles = document.querySelectorAll('.app-title-text');
    headerTitles.forEach(el => el.textContent = APEX_CONFIG.title);

    const versionDisplays = document.querySelectorAll('.app-version-text');
    versionDisplays.forEach(el => el.textContent = `v${APEX_CONFIG.version}`);

    const footerMeta = document.querySelectorAll('.app-footer-meta');
    footerMeta.forEach(el => {
        const year = APEX_CONFIG.year || new Date().getFullYear();
        const author = APEX_CONFIG.author || "";
        el.textContent = `${APEX_CONFIG.title} v${APEX_CONFIG.version} © ${year} ${author}`;
    });
});
