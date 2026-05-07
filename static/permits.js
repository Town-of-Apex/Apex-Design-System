/**
 * permits.js
 * App-specific logic for the Permit Tracker page.
 * Depends on: apex-core.js (apex.showModal, apex.showToast)
 *
 * Exposes a single global namespace: window.Permits
 * All onclick attributes in permits.html call through this object.
 */

window.Permits = (() => {

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    let _editingId = null;
    let _searchTimer = null;

    // -----------------------------------------------------------------------
    // API helpers
    // -----------------------------------------------------------------------

    /** Resolve the API root from the <base> tag so sub-path routing works. */
    function apiRoot() {
        const href = document.querySelector('base')?.getAttribute('href') || '/';
        return href.replace(/\/$/, '');
    }

    /**
     * Thin fetch wrapper.
     * Unwraps the standard { success, data } envelope.
     * Throws an Error with the server's message on failure.
     */
    async function apiFetch(path, options = {}) {
        const res = await fetch(`${apiRoot()}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        const json = await res.json();
        if (!res.ok) {
            const msg = json?.detail?.error?.message || json?.detail || `HTTP ${res.status}`;
            throw new Error(msg);
        }
        return json.data;
    }

    // -----------------------------------------------------------------------
    // Utility
    // -----------------------------------------------------------------------

    function escHtml(str) {
        const d = document.createElement('div');
        d.textContent = str ?? '';
        return d.innerHTML;
    }

    function formatDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    /**
     * Maps a status string to a CSS class pair (background + text color)
     * using only the design system's semantic color tokens.
     */
    function statusStyle(status) {
        const map = {
            'Submitted':    'background: var(--brand-primary-soft); color: var(--brand-primary);',
            'Under Review': 'background: var(--brand-accent-soft); color: var(--town-dim-grey);',
            'Approved':     'background: rgba(68,136,62,0.10); color: var(--town-forest-green);',
            'Rejected':     'background: rgba(224,79,57,0.10); color: var(--town-cinnabar);',
            'Closed':       'background: var(--bg-inner); color: var(--text-muted);',
        };
        return map[status] || map['Submitted'];
    }

    // -----------------------------------------------------------------------
    // Load & Render
    // -----------------------------------------------------------------------

    async function load() {
        const search = document.getElementById('permit-search')?.value?.trim() || '';
        const status = document.getElementById('permit-status-filter')?.value || '';
        const tbody  = document.getElementById('permits-tbody');
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: var(--space-8); text-align: center;">
                    <p class="metadata">Loading...</p>
                </td>
            </tr>`;

        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);

        try {
            const permits = await apiFetch(`/api/permits?${params}`);
            renderTable(permits);
        } catch (err) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="padding: var(--space-8); text-align: center;">
                        <p class="body-text text-cinnabar">Failed to load: ${escHtml(err.message)}</p>
                    </td>
                </tr>`;
        }
    }

    function renderTable(permits) {
        const tbody = document.getElementById('permits-tbody');
        if (!permits?.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="padding: var(--space-10); text-align: center;">
                        <p class="metadata">No permits found.</p>
                        <p class="body-text mt-4">
                            <a href="#" onclick="Permits.openCreate(); return false;">Submit the first permit.</a>
                        </p>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = permits.map(p => `
            <tr class="permits-row">
                <td class="permits-td" style="font-family: monospace; font-size: 0.8rem;">${escHtml(p.permit_number)}</td>
                <td class="permits-td">
                    <span class="body-text" style="font-weight: 600;">${escHtml(p.applicant_name)}</span>
                    ${p.applicant_email
                        ? `<br><span class="metadata" style="font-size: 0.7rem;">${escHtml(p.applicant_email)}</span>`
                        : ''}
                </td>
                <td class="permits-td text-muted">${escHtml(p.project_address)}</td>
                <td class="permits-td">${escHtml(p.permit_type)}</td>
                <td class="permits-td">
                    <span style="
                        display: inline-block;
                        padding: 0.2rem 0.6rem;
                        border-radius: var(--radius-btn);
                        font-size: 0.7rem;
                        font-weight: 600;
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                        ${statusStyle(p.status)}
                    ">${escHtml(p.status)}</span>
                </td>
                <td class="permits-td text-muted" style="font-size: 0.8rem; white-space: nowrap;">${formatDate(p.created_at)}</td>
                <td class="permits-td" style="text-align: right; white-space: nowrap;">
                    <button
                        class="btn btn-ghost"
                        style="padding: var(--space-1) var(--space-2); font-size: 0.8rem;"
                        onclick="Permits.openEdit(${p.id})"
                        aria-label="Edit ${escHtml(p.permit_number)}"
                    >
                        <svg class="icon" viewBox="0 0 24 24" style="width:14px;height:14px;">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                    </button>
                    <button
                        class="btn btn-ghost"
                        style="padding: var(--space-1) var(--space-2); font-size: 0.8rem; color: var(--town-cinnabar);"
                        onclick="Permits.confirmDelete(${p.id}, '${escHtml(p.permit_number)}')"
                        aria-label="Delete ${escHtml(p.permit_number)}"
                    >
                        <svg class="icon" viewBox="0 0 24 24" style="width:14px;height:14px;">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                        </svg>
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function debounceSearch() {
        clearTimeout(_searchTimer);
        _searchTimer = setTimeout(load, 300);
    }

    // -----------------------------------------------------------------------
    // Form Modal — Create
    // -----------------------------------------------------------------------

    function openCreate() {
        _editingId = null;
        document.getElementById('permit-form-title').textContent = 'New Permit Application';
        document.getElementById('permit-form-submit').textContent = 'Submit Permit';
        document.getElementById('f-status-group').style.display = 'none';
        document.getElementById('permit-form').reset();
        document.getElementById('permit-form-overlay').classList.add('active');
    }

    // -----------------------------------------------------------------------
    // Form Modal — Edit
    // -----------------------------------------------------------------------

    async function openEdit(id) {
        try {
            const permit = await apiFetch(`/api/permits/${id}`);
            _editingId = id;

            document.getElementById('permit-form-title').textContent = `Edit — ${permit.permit_number}`;
            document.getElementById('permit-form-submit').textContent = 'Save Changes';
            document.getElementById('f-status-group').style.display = '';

            document.getElementById('f-name').value        = permit.applicant_name  || '';
            document.getElementById('f-email').value       = permit.applicant_email || '';
            document.getElementById('f-address').value     = permit.project_address || '';
            document.getElementById('f-type').value        = permit.permit_type     || '';
            document.getElementById('f-status').value      = permit.status          || 'Submitted';
            document.getElementById('f-description').value = permit.description     || '';

            document.getElementById('permit-form-overlay').classList.add('active');
        } catch (err) {
            apex.showToast(`Could not load permit: ${err.message}`, 'error');
        }
    }

    function closeForm(event) {
        // If triggered by overlay click, only close when the backdrop is the target
        if (event && event.target !== document.getElementById('permit-form-overlay')) return;
        document.getElementById('permit-form-overlay').classList.remove('active');
        _editingId = null;
    }

    // -----------------------------------------------------------------------
    // Form Submit
    // -----------------------------------------------------------------------

    async function submitForm(event) {
        event.preventDefault();

        const payload = {
            applicant_name:  document.getElementById('f-name').value.trim(),
            applicant_email: document.getElementById('f-email').value.trim() || null,
            project_address: document.getElementById('f-address').value.trim(),
            permit_type:     document.getElementById('f-type').value,
            description:     document.getElementById('f-description').value.trim(),
        };

        if (_editingId !== null) {
            payload.status = document.getElementById('f-status').value;
        }

        const submitBtn = document.getElementById('permit-form-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            if (_editingId === null) {
                await apiFetch('/api/permits', { method: 'POST', body: JSON.stringify(payload) });
                apex.showToast('Permit submitted successfully.', 'success');
            } else {
                await apiFetch(`/api/permits/${_editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
                apex.showToast('Permit updated.', 'success');
            }
            document.getElementById('permit-form-overlay').classList.remove('active');
            _editingId = null;
            load();
        } catch (err) {
            apex.showToast(`Error: ${err.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = _editingId !== null ? 'Save Changes' : 'Submit Permit';
        }
    }

    // -----------------------------------------------------------------------
    // Delete (uses global apex.showModal from apex-core.js)
    // -----------------------------------------------------------------------

    function confirmDelete(id, permitNumber) {
        apex.showModal(
            'Delete Permit',
            `<p class="body-text">Are you sure you want to permanently delete <strong>${escHtml(permitNumber)}</strong>? This cannot be undone.</p>`,
            {
                type: 'danger',
                confirmText: 'Delete Permit',
                onConfirm: () => doDelete(id),
            }
        );
    }

    async function doDelete(id) {
        try {
            await apiFetch(`/api/permits/${id}`, { method: 'DELETE' });
            apex.showToast('Permit deleted.', 'success');
            load();
        } catch (err) {
            apex.showToast(`Delete failed: ${err.message}`, 'error');
        }
    }

    // -----------------------------------------------------------------------
    // Table cell styles injected once (minimal, structural only)
    // These are table layout utilities — not reusable design system components.
    // -----------------------------------------------------------------------

    (function injectTableStyles() {
        const id = 'permits-table-styles';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
            .permits-th {
                padding: var(--space-3) var(--space-4);
                text-align: left;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: var(--text-muted);
                white-space: nowrap;
            }
            .permits-td {
                padding: var(--space-3) var(--space-4);
                border-top: 1px solid var(--border-subtle);
                vertical-align: middle;
            }
            .permits-row:hover .permits-td {
                background: var(--bg-canvas);
            }
        `;
        document.head.appendChild(style);
    })();

    // -----------------------------------------------------------------------
    // Init — apex-core.js fires 'apex:pageLoaded' after each tab's HTML is
    // fetched and injected. Both scripts are deferred, and the event fires
    // asynchronously (after a fetch), so no wrapper is needed here.
    // -----------------------------------------------------------------------
    document.addEventListener('apex:pageLoaded', (e) => {
        if (e.detail?.tabId === 'permits') load();
    });

    // Public API
    return { load, debounceSearch, openCreate, openEdit, closeForm, submitForm, confirmDelete };

})();
