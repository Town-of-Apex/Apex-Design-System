/**
 * APEX MODERN - PROJECT CONFIGURATION
 * Edit this file to update tab navigation and project-wide settings.
 * Each tab maps to a page snippet in the /pages/ directory.
 */
const APEX_CONFIG = {
    enableAuth: true,
    tabs: [
        { id: "home", label: "Home", file: "pages/home.html" },
        { id: "permits", label: "Permits", file: "pages/permits.html" },
        { id: "components", label: "Components", file: "pages/components.html" },
        { id: "colors", label: "Colors", file: "pages/colors.html" },
        { id: "settings", label: "Settings", file: "pages/settings.html", hidden: true }
    ]
};