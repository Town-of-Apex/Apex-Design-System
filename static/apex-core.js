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

    // --- 1B. BRAND COLOR MANAGEMENT & SETTINGS SYSTEM ---

    // Preview function (only updates CSS variables on the document, does not write to localStorage)
    const previewBrandColor = (type, colorVariable) => {
        if (type === 'primary') {
            document.documentElement.style.setProperty('--brand-primary', `var(--town-${colorVariable})`);
        } else if (type === 'accent') {
            document.documentElement.style.setProperty('--brand-accent', `var(--town-${colorVariable})`);
        }
    };

    // Live preview when changing colors on the settings page
    window.updateAppColor = (type, selectElement) => {
        previewBrandColor(type, selectElement.value);
        checkSettingsDirty();
    };

    // Load and apply saved colors
    const initBrandColors = () => {
        const primary = localStorage.getItem('apex-primary-color') || 'forest-green';
        const accent = localStorage.getItem('apex-accent-color') || 'sunflower-gold';
        previewBrandColor('primary', primary);
        previewBrandColor('accent', accent);
    };
    initBrandColors();

    // Global settings state
    let initialSettings = null;
    let hasUnsavedChanges = false;

    const getSavedSettings = () => {
        return {
            'primary-color': localStorage.getItem('apex-primary-color') || 'forest-green',
            'accent-color': localStorage.getItem('apex-accent-color') || 'sunflower-gold',
            'coolest-muppet': localStorage.getItem('apex-coolest-muppet') || 'Dr. Teeth',
            'something-else': localStorage.getItem('apex-something-else') !== 'false', // default true
            'email-notifications': localStorage.getItem('apex-email-notifications') === 'true', // default false
            'even-more-things': localStorage.getItem('apex-even-more-things') !== 'false' // default true
        };
    };

    const getCurrentSettingsFromUI = () => {
        const primarySelect = document.getElementById('setting-primary-color');
        const accentSelect = document.getElementById('setting-accent-color');
        const muppetSelect = document.getElementById('setting-coolest-muppet');
        const somethingElse = document.getElementById('setting-something-else');
        const emailNotifications = document.getElementById('setting-email-notifications');
        const evenMoreThings = document.getElementById('setting-even-more-things');

        return {
            'primary-color': primarySelect ? primarySelect.value : 'forest-green',
            'accent-color': accentSelect ? accentSelect.value : 'sunflower-gold',
            'coolest-muppet': muppetSelect ? muppetSelect.value : 'Dr. Teeth',
            'something-else': somethingElse ? somethingElse.checked : true,
            'email-notifications': emailNotifications ? emailNotifications.checked : false,
            'even-more-things': evenMoreThings ? evenMoreThings.checked : true
        };
    };

    const checkSettingsDirty = () => {
        if (!initialSettings) return;
        const current = getCurrentSettingsFromUI();
        let changed = false;
        for (const key in initialSettings) {
            if (initialSettings[key] !== current[key]) {
                changed = true;
                break;
            }
        }
        hasUnsavedChanges = changed;
    };

    window.saveSettings = () => {
        const current = getCurrentSettingsFromUI();

        // Save to localStorage
        localStorage.setItem('apex-primary-color', current['primary-color']);
        localStorage.setItem('apex-accent-color', current['accent-color']);
        localStorage.setItem('apex-coolest-muppet', current['coolest-muppet']);
        localStorage.setItem('apex-something-else', current['something-else']);
        localStorage.setItem('apex-email-notifications', current['email-notifications']);
        localStorage.setItem('apex-even-more-things', current['even-more-things']);

        // Apply colors
        previewBrandColor('primary', current['primary-color']);
        previewBrandColor('accent', current['accent-color']);

        initialSettings = current;
        hasUnsavedChanges = false;

        apex.showToast('Settings saved successfully', 'success');
    };

    window.discardSettingsChanges = () => {
        if (!initialSettings) return;

        // Re-populate UI
        const primarySelect = document.getElementById('setting-primary-color');
        const accentSelect = document.getElementById('setting-accent-color');
        const muppetSelect = document.getElementById('setting-coolest-muppet');
        const somethingElse = document.getElementById('setting-something-else');
        const emailNotifications = document.getElementById('setting-email-notifications');
        const evenMoreThings = document.getElementById('setting-even-more-things');

        if (primarySelect) primarySelect.value = initialSettings['primary-color'];
        if (accentSelect) accentSelect.value = initialSettings['accent-color'];
        if (muppetSelect) muppetSelect.value = initialSettings['coolest-muppet'];
        if (somethingElse) somethingElse.checked = initialSettings['something-else'];
        if (emailNotifications) emailNotifications.checked = initialSettings['email-notifications'];
        if (evenMoreThings) evenMoreThings.checked = initialSettings['even-more-things'];

        // Revert previews
        previewBrandColor('primary', initialSettings['primary-color']);
        previewBrandColor('accent', initialSettings['accent-color']);

        hasUnsavedChanges = false;
        apex.showToast('Changes discarded', 'info');
    };

    // Watch for browser close / refresh with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = ''; // Standard modern browser way to trigger unload confirmation dialog
        }
    });

    document.addEventListener('apex:pageLoaded', (e) => {
        if (e.detail.tabId === 'settings') {
            const saved = getSavedSettings();

            const primarySelect = document.getElementById('setting-primary-color');
            const accentSelect = document.getElementById('setting-accent-color');
            const muppetSelect = document.getElementById('setting-coolest-muppet');
            const somethingElse = document.getElementById('setting-something-else');
            const emailNotifications = document.getElementById('setting-email-notifications');
            const evenMoreThings = document.getElementById('setting-even-more-things');

            if (primarySelect) primarySelect.value = saved['primary-color'];
            if (accentSelect) accentSelect.value = saved['accent-color'];
            if (muppetSelect) muppetSelect.value = saved['coolest-muppet'];
            if (somethingElse) somethingElse.checked = saved['something-else'];
            if (emailNotifications) emailNotifications.checked = saved['email-notifications'];
            if (evenMoreThings) evenMoreThings.checked = saved['even-more-things'];

            initialSettings = getCurrentSettingsFromUI();
            hasUnsavedChanges = false;

            // Attach event listeners to all settings fields
            const inputs = [primarySelect, accentSelect, muppetSelect, somethingElse, emailNotifications, evenMoreThings];
            inputs.forEach(input => {
                if (input) {
                    input.addEventListener('change', checkSettingsDirty);
                    input.addEventListener('input', checkSettingsDirty);
                }
            });
        }
    });

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
    const sidebarContainer = document.getElementById('app-sidebar');
    const sidebarNav = document.getElementById('sidebar-nav');

    const navStyle = (typeof APEX_CONFIG !== 'undefined' && APEX_CONFIG.navigationStyle) ? APEX_CONFIG.navigationStyle : 'header';

    let currentTabId = null;

    const loadTab = async (tabId, fileUrl) => {
        if (!contentContainer) return;

        // Update active state in UI
        document.querySelectorAll('.tab-link, .sidebar-link').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        try {
            const response = await fetch(fileUrl);
            if (response.ok) {
                const html = await response.text();
                contentContainer.innerHTML = html;

                // Clear the sidebar on new page loads if it's meant to be page-specific
                if (navStyle === 'header' && sidebarContainer) {
                    sidebarContainer.style.display = 'none';
                    if (sidebarNav) sidebarNav.innerHTML = '';
                }

                // Re-populate metadata for any elements in the newly loaded content
                await populateMetadata();

                // Track the successfully loaded tab ID
                currentTabId = tabId;

                // Emit a custom event so the application can react to page loads
                document.dispatchEvent(new CustomEvent('apex:pageLoaded', { detail: { tabId } }));
            } else {
                contentContainer.innerHTML = `<div class="app-container"><p class="text-cinnabar mt-6">Error loading content: ${response.statusText}. Ensure you are serving files via HTTP.</p></div>`;
            }
        } catch (error) {
            contentContainer.innerHTML = `<div class="app-container"><p class="text-cinnabar mt-6">Error loading content. Ensure you are running a local server (e.g., python -m http.server).</p></div>`;
        }
    };

    let isRevertingHash = false;
    const handleRoute = () => {
        if (isRevertingHash) {
            isRevertingHash = false;
            return;
        }

        const hash = window.location.hash.replace('#', '') || 'home';

        // Check if there are unsaved settings changes before navigating
        if (hasUnsavedChanges) {
            const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) {
                // Revert hash to the previous tab
                isRevertingHash = true;
                window.location.hash = currentTabId || 'settings';
                return;
            } else {
                // Revert brand colors back to the saved state in localStorage
                const saved = getSavedSettings();
                previewBrandColor('primary', saved['primary-color']);
                previewBrandColor('accent', saved['accent-color']);
                hasUnsavedChanges = false;
                initialSettings = null;
            }
        }

        const tab = APEX_CONFIG.tabs.find(t => t.id === hash) || APEX_CONFIG.tabs[0];

        if (tab) {
            loadTab(tab.id, tab.file);
        }
    };

    if (typeof APEX_CONFIG !== 'undefined' && APEX_CONFIG.tabs) {
        if (APEX_CONFIG.tabs.length > 1) {
            APEX_CONFIG.tabs.forEach((tab) => {
                if (tab.hidden) return;

                // Header Tabs
                if (navStyle === 'header' || navStyle === 'both') {
                    const btn = document.createElement('button');
                    btn.className = 'tab-link';
                    btn.textContent = tab.label;
                    btn.setAttribute('data-tab', tab.id);
                    btn.onclick = () => window.location.hash = tab.id;
                    if (tabsContainer) tabsContainer.appendChild(btn);
                }

                // Sidebar Links
                if (navStyle === 'sidebar' || navStyle === 'both') {
                    const sBtn = document.createElement('button');
                    sBtn.className = 'sidebar-link';
                    sBtn.textContent = tab.label;
                    sBtn.setAttribute('data-tab', tab.id);
                    sBtn.onclick = () => window.location.hash = tab.id;
                    if (sidebarNav) sidebarNav.appendChild(sBtn);
                }
            });

            if (navStyle === 'sidebar' && tabsContainer) {
                tabsContainer.style.display = 'none';
            }
            if ((navStyle === 'sidebar' || navStyle === 'both') && sidebarContainer) {
                sidebarContainer.style.display = 'flex';
            }

            window.addEventListener('hashchange', handleRoute);
            handleRoute(); // Initialize on load
        } else {
            if (tabsContainer) tabsContainer.style.display = 'none';
            if (sidebarContainer) sidebarContainer.style.display = 'none';
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
        },

        /**
         * Dynamically populates the sidebar with custom items for page-specific sub-navigation.
         * @param {Array} items - Array of { id, label, onClick, active } objects. Pass null to hide sidebar.
         */
        setSidebar: (items) => {
            const sidebarContainer = document.getElementById('app-sidebar');
            const sidebarNav = document.getElementById('sidebar-nav');
            if (!sidebarContainer || !sidebarNav) return;

            if (!items || items.length === 0) {
                sidebarContainer.style.display = 'none';
                return;
            }

            sidebarNav.innerHTML = '';
            items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = `sidebar-link ${item.active ? 'active' : ''}`;
                btn.textContent = item.label;
                if (item.id) btn.setAttribute('data-sidebar-id', item.id);

                btn.onclick = (e) => {
                    // Visually update active state
                    sidebarNav.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (item.onClick) item.onClick(e, item);
                };
                sidebarNav.appendChild(btn);
            });
            sidebarContainer.style.display = 'flex';
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

    // --- 7. SIDEBAR RESIZER & COLLAPSIBLE SYSTEM ---
    const initSidebarSystem = () => {
        const sidebar = document.getElementById('app-sidebar');
        const resizer = document.getElementById('sidebar-resizer');
        const toggleBtn = document.getElementById('sidebar-toggle-btn');

        if (!sidebar || !resizer || !toggleBtn) return;

        let isResizing = false;
        let startWidth = 250;
        let startX = 0;

        // Load saved state from localStorage
        const savedWidth = localStorage.getItem('apex-sidebar-width');
        const savedCollapsed = localStorage.getItem('apex-sidebar-collapsed') === 'true';

        // Initialize width (default 250px)
        let currentWidth = savedWidth ? parseInt(savedWidth, 10) : 250;
        currentWidth = Math.max(160, Math.min(currentWidth, 450));

        // Apply initial state
        if (savedCollapsed) {
            sidebar.classList.add('collapsed');
            sidebar.style.width = '0px';
            sidebar.style.setProperty('--sidebar-width', '0px');
        } else {
            sidebar.style.width = `${currentWidth}px`;
            sidebar.style.setProperty('--sidebar-width', `${currentWidth}px`);
        }

        // 1. Drag to Resize Logic
        resizer.addEventListener('mousedown', (e) => {
            if (sidebar.classList.contains('collapsed')) return;
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.getBoundingClientRect().width;

            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            resizer.classList.add('resizing');
            sidebar.classList.add('resizing');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            let newWidth = startWidth + deltaX;

            // Clamp sidebar width between 160px and 450px
            newWidth = Math.max(160, Math.min(newWidth, 450));

            sidebar.style.width = `${newWidth}px`;
            sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
            currentWidth = newWidth;
        });

        document.addEventListener('mouseup', () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            resizer.classList.remove('resizing');
            sidebar.classList.remove('resizing');

            // Save width preference
            localStorage.setItem('apex-sidebar-width', currentWidth);
        });

        // 2. Toggle Collapse Logic
        const toggleSidebar = () => {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            localStorage.setItem('apex-sidebar-collapsed', isCollapsed);

            if (isCollapsed) {
                sidebar.style.width = '0px';
                sidebar.style.setProperty('--sidebar-width', '0px');
            } else {
                sidebar.style.width = `${currentWidth}px`;
                sidebar.style.setProperty('--sidebar-width', `${currentWidth}px`);
            }
        };

        toggleBtn.addEventListener('click', toggleSidebar);
    };

    // Initialize sidebar system
    initSidebarSystem();
});