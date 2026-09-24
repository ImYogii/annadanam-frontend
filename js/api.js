// Small wrapper around fetch() so every page doesn't repeat the same boilerplate.

async function apiGet(path, useAuth = false) {
    const res = await fetch(API_BASE_URL + path, { headers: authHeaders(useAuth) });
    return handleResponse(res);
}

async function apiSend(method, path, body, useAuth = false) {
    const res = await fetch(API_BASE_URL + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders(useAuth) },
        body: JSON.stringify(body)
    });
    return handleResponse(res);
}

async function apiDelete(path, useAuth = true) {
    const res = await fetch(API_BASE_URL + path, {
        method: 'DELETE',
        headers: authHeaders(useAuth)
    });
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    return true;
}

function authHeaders(useAuth) {
    if (!useAuth) return {};
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function handleResponse(res) {
    if (res.status === 401 || res.status === 403) {
        // Token missing/expired - send the organizer back to log in.
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login.html';
        throw new Error('Not authenticated');
    }
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || ('Request failed: ' + res.status));
    }
    return res.status === 204 ? null : res.json();
}

function requireLogin() {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = '/admin/login.html';
    }
}
