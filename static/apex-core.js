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
    window.APEX_METADATA = null;

    const populateMetadata = async () => {
        // Fetch metadata if not already loaded
        if (!window.APEX_METADATA) {
            try {
                const response = await fetch('app_metadata.json');

                if (response.ok) {
                    window.APEX_METADATA = await response.json();
                } else {
                    console.error("Failed to load app_metadata.json");
                    return;
                }
            } catch (error) {
                console.error("Error fetching metadata:", error);
                return;
            }
        }

        const meta = window.APEX_METADATA;

        if (meta.title) {
            document.title = meta.title;
        }

        const headerTitles = document.querySelectorAll('.app-title-text');
        headerTitles.forEach(el => el.textContent = meta.title || "Apex App");

        const versionDisplays = document.querySelectorAll('.app-version-text');
        versionDisplays.forEach(el => el.textContent = meta.version ? `v${meta.version}` : "");

        if (meta.logo) {
            const logoEl = document.getElementById('app-logo');
            if (logoEl) {
                logoEl.style.webkitMaskImage = `url('${meta.logo}')`;
                logoEl.style.maskImage = `url('${meta.logo}')`;
            }
        }

        if (meta.favicon) {
            const faviconLink = document.getElementById('app-favicon');
            if (faviconLink) faviconLink.href = meta.favicon;
        }

        const footerMeta = document.querySelectorAll('.app-footer-meta');

        footerMeta.forEach(el => {
            const year = meta.year || new Date().getFullYear();
            const author = meta.author || "";
            const title = meta.title || "Apex App";
            const version = meta.version || "0.0.0";
            el.textContent = `${title} v${version} © ${year} ${author}`;
        });
    };

    // Initial population
    populateMetadata();


    // --- 3. TAB & ROUTING LOGIC ---
    const contentContainer = document.getElementById('app-content');
    const tabsContainer = document.getElementById('app-tabs');

    const loadTab = async (tabId, fileUrl) => {
        if (!contentContainer) return;

        // Update active state in UI
        document.querySelectorAll('.tab-link').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        try {
            const response = await fetch(fileUrl);
            if (response.ok) {
                const html = await response.text();
                contentContainer.innerHTML = html;
                
                // Re-populate metadata for any elements in the newly loaded content
                await populateMetadata();

                
                // Emit a custom event so the application can react to page loads
                document.dispatchEvent(new CustomEvent('apex:pageLoaded', { detail: { tabId } }));
            } else {
                contentContainer.innerHTML = `<div class="app-container"><p class="text-cinnabar mt-6">Error loading content: ${response.statusText}. Ensure you are serving files via HTTP.</p></div>`;
            }
        } catch (error) {
            contentContainer.innerHTML = `<div class="app-container"><p class="text-cinnabar mt-6">Error loading content. Ensure you are running a local server (e.g., python -m http.server).</p></div>`;
        }
    };

    const handleRoute = () => {
        const hash = window.location.hash.replace('#', '');
        const tab = APEX_CONFIG.tabs.find(t => t.id === hash) || APEX_CONFIG.tabs[0];
        
        if (tab) {
            loadTab(tab.id, tab.file);
        }
    };

    if (typeof APEX_CONFIG !== 'undefined' && APEX_CONFIG.tabs) {
        if (APEX_CONFIG.tabs.length > 1) {
            APEX_CONFIG.tabs.forEach((tab) => {
                if (tab.hidden) return;
                const btn = document.createElement('button');
                btn.className = 'tab-link';
                btn.textContent = tab.label;
                btn.setAttribute('data-tab', tab.id);
                btn.onclick = () => window.location.hash = tab.id;
                if (tabsContainer) tabsContainer.appendChild(btn);
            });
            
            window.addEventListener('hashchange', handleRoute);
            handleRoute(); // Initialize on load
        } else {
            if (tabsContainer) tabsContainer.style.display = 'none';
            if (APEX_CONFIG.tabs.length === 1) {
                 loadTab(APEX_CONFIG.tabs[0].id, APEX_CONFIG.tabs[0].file);
            }
        }
    }

    // --- 4. DROPDOWN LOGIC ---
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    
    if (settingsToggle && settingsMenu) {
        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!settingsToggle.contains(e.target) && !settingsMenu.contains(e.target)) {
                settingsMenu.classList.remove('show');
            }
        });
    }

    // --- 5. AUTHENTICATION STUB ---
    const profileContainer = document.getElementById('user-profile');
    const profileToggle = document.getElementById('profile-toggle');

    if (profileContainer) {
        if (typeof APEX_CONFIG !== 'undefined' && APEX_CONFIG.enableAuth === false) {
            profileContainer.style.display = 'none';
        } else {
            profileContainer.style.display = 'flex';
        }
    }

    if (profileToggle) {
        profileToggle.addEventListener('click', () => {
            apex.showModal('Profile Information', `
                <div class="stack" style="gap: var(--space-4);">
                    <div style="display: flex; align-items: center; gap: var(--space-4);">
                        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-surface-3); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
                            <svg class="icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div>
                            <h3 class="title-ui">Apex User</h3>
                            <p class="metadata">user@townofapex.org</p>
                        </div>
                    </div>
                    <hr style="border: 0; border-top: 1px solid var(--border-subtle);">
                    <p class="body-text">Authentication is currently in <strong>Stub Mode</strong>. In the future, this will integrate with Azure AD / Microsoft Entra ID.</p>
                    <button class="btn btn-secondary" onclick="apex.showToast('Sign out initiated', 'info')">Sign Out</button>
                </div>
            `);
        });
    }

    // --- 6. GLOBAL UI HELPERS (Modals, Toasts) ---
    window.apex = {
        /**
         * Shows a standardized modal
         * @param {string} title 
         * @param {string} content - HTML or string
         * @param {object} options - { type: 'normal' | 'danger', onConfirm: fn }
         */
        showModal: (title, content, options = {}) => {
            const overlay = document.getElementById('global-modal-overlay');
            const card = overlay.querySelector('.modal-card');
            const header = overlay.querySelector('.modal-header h3');
            const body = overlay.querySelector('.modal-body');
            const footer = overlay.querySelector('.modal-footer');

            header.textContent = title;
            body.innerHTML = content;
            footer.innerHTML = ''; // Clear previous buttons

            // Close button in header
            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn btn-ghost';
            closeBtn.innerHTML = '&times;';
            closeBtn.style.fontSize = '1.5rem';
            closeBtn.onclick = () => apex.hideModal();
            overlay.querySelector('.modal-header').appendChild(closeBtn);
            
            if (options.type === 'danger') {
                overlay.setAttribute('data-persistent', 'true'); // Don't close on click-away
                
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn btn-secondary';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.onclick = () => apex.hideModal();

                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'btn btn-danger';
                confirmBtn.textContent = options.confirmText || 'Confirm Action';
                confirmBtn.onclick = () => {
                    if (options.onConfirm) options.onConfirm();
                    apex.hideModal();
                };

                footer.appendChild(cancelBtn);
                footer.appendChild(confirmBtn);
            } else {
                overlay.removeAttribute('data-persistent');
                const closeFooterBtn = document.createElement('button');
                closeFooterBtn.className = 'btn btn-primary';
                closeFooterBtn.textContent = 'Close';
                closeFooterBtn.onclick = () => apex.hideModal();
                footer.appendChild(closeFooterBtn);
            }

            overlay.classList.add('active');
        },

        hideModal: () => {
            const overlay = document.getElementById('global-modal-overlay');
            overlay.classList.remove('active');
            // Clean up the header close button to avoid duplicates
            const closeBtn = overlay.querySelector('.modal-header .btn-ghost');
            if (closeBtn) closeBtn.remove();
        },

        /**
         * Shows a temporary toast message
         * @param {string} message 
         * @param {string} type - 'success', 'error', 'info'
         */
        showToast: (message, type = 'info', duration = 3000) => {
            const container = document.getElementById('global-toast-container');
            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            toast.innerHTML = `<span>${message}</span>`;
            
            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('toast-out');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    };

    // Modal click-away logic
    const globalModalOverlay = document.getElementById('global-modal-overlay');
    if (globalModalOverlay) {
        globalModalOverlay.addEventListener('click', (e) => {
            if (e.target === globalModalOverlay && !globalModalOverlay.hasAttribute('data-persistent')) {
                apex.hideModal();
            }
        });
    }

    // --- 6. FEATURE DEMOS (File Metadata) ---
    window.analyzeFileMetadata = () => {
        const input = document.getElementById('demo-file-input');
        const resultsContainer = document.getElementById('metadata-results');
        const resultsList = document.getElementById('metadata-list');

        if (!input || !input.files || input.files.length === 0) {
            apex.showToast('Please select a file first', 'error');
            return;
        }

        const file = input.files[0];
        resultsList.innerHTML = `
            <p class="body-text"><strong>Filename:</strong> ${file.name}</p>
            <p class="body-text"><strong>Size:</strong> ${formatBytes(file.size)}</p>
            <p class="body-text"><strong>Type:</strong> ${file.type || 'Unknown'}</p>
            <p class="body-text"><strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleString()}</p>
        `;

        resultsContainer.style.display = 'block';
        apex.showToast('Analysis complete', 'success');
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
});