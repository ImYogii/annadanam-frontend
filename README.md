# Annadanam Frontend (Static Site)

Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no
Node dependencies. It talks to the backend purely over `fetch()` calls to
the REST API.

## Run it locally

The backend must be running first (`localhost:8080` by default — see
`annadanam-backend/README.md`).

Then serve this folder as static files. Pick whichever you have installed:

**Option A — Python (already installed on most machines):**
```bash
cd annadanam-frontend
python3 -m http.server 3000
```

**Option B — Node.js:**
```bash
cd annadanam-frontend
npx serve -p 3000
```

Then open **http://localhost:3000** in your browser.

> Why not just double-click `index.html`? Opening a file directly
> (`file://...`) blocks the browser's `fetch()` calls to the backend for
> security reasons. It must be served over `http://`, even locally.

## Pointing at a different backend

Edit `js/config.js`:
```js
const API_BASE_URL = 'http://localhost:8080';
```
Change this if you deploy the backend elsewhere later.

## File structure

```
index.html              Public event listing (Today/Tomorrow/Upcoming)
admin/login.html         Organizer login
admin/dashboard.html     List/edit/delete events
admin/event-form.html    Create or edit a single event
js/config.js             API base URL
js/api.js                Shared fetch helper (attaches JWT token)
js/public.js             Renders the public event cards
css/style.css            Shared styling
```

## Deploying

Since it's just static files, this can go on Netlify, Vercel, GitHub
Pages, or Render's free "Static Site" option — all simpler than deploying
the backend, since there's no build step or database. Just remember to
update `API_BASE_URL` in `js/config.js` to point at your deployed backend
URL, and update `CORS_ALLOWED_ORIGIN` on the backend to match wherever
this ends up.
