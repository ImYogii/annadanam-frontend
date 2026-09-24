let mapsApiKey = '';

document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();
    showWakingUpMessage();
    try {
        const config = await apiGet('/api/public/config');
        mapsApiKey = config.googleMapsApiKey;
        document.getElementById('villageName').textContent = config.villageName;
    } catch (e) {
        console.error('Could not load config', e);
    }

    await Promise.all([
        loadDay('today', 'countToday'),
        loadDay('tomorrow', 'countTomorrow'),
        loadDay('upcoming', 'countUpcoming')
    ]);
});

async function loadDay(day, countElementId) {
    const panel = document.getElementById(day);
    try {
        const events = await apiGet(`/api/public/events/${day}`);
        document.getElementById(countElementId).textContent = events.length;
        renderEvents(panel, events, day === 'upcoming');
        panel.classList.add('visible');
    } catch (e) {
        panel.innerHTML = `<div class="empty-state"><p>Could not load events. Is the backend running?</p></div>`;
        console.error(e);
    }
}

function renderEvents(panel, events, showDateBadge) {
    if (events.length === 0) {
        panel.innerHTML = `<div class="empty-state"><p>No annadanam events posted yet.</p></div>`;
        return;
    }

    panel.innerHTML = events.map(event => eventCardHtml(event, showDateBadge)).join('');
}

function eventCardHtml(event, showDateBadge) {
    const timeRange = [formatTime(event.startTime), event.endTime ? formatTime(event.endTime) : null]
        .filter(Boolean).join(' – ');

    const dateBadge = showDateBadge
        ? `<p class="event-date-badge">${formatDate(event.eventDate)}</p>`
        : '';

    const contact = event.contactNumber
        ? `<p class="event-contact">Contact: <a href="tel:${event.contactNumber}">${event.contactNumber}</a></p>`
        : '';

    const description = event.description
        ? `<p class="event-desc">${escapeHtml(event.description)}</p>`
        : '';

    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${event.latitude},${event.longitude}`;

    return `
        <article class="event-card">
            <div class="event-info">
                ${dateBadge}
                <h2>${escapeHtml(event.title)}</h2>
                <p class="event-time">${timeRange}</p>
                <p class="event-org">Hosted by ${escapeHtml(event.organizerName)}</p>
                ${description}
                <p class="event-addr">${escapeHtml(event.venueAddress)}</p>
                ${contact}
                <a class="btn-navigate" href="${event.directionsUrl}" target="_blank" rel="noopener">
                    Navigate with Google Maps →
                </a>
            </div>
            <div class="event-map">
                <iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapSrc}"></iframe>
            </div>
        </article>
    `;
}

function setupTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.day-panel');

    // Show the initially-active panel immediately (page just loaded, no fade needed).
    panels.forEach(p => { if (!p.hidden) p.classList.add('visible'); });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(p => p.classList.remove('visible'));

            setTimeout(() => {
                panels.forEach(p => {
                    p.hidden = p.id !== target;
                    if (p.id === target) p.classList.add('visible');
                });
            }, 150);
        });
    });
}

function showWakingUpMessage() {
    const skeleton = skeletonHtml(2);
    document.getElementById('today').innerHTML = skeleton;
    document.getElementById('tomorrow').innerHTML = skeleton;
    document.getElementById('upcoming').innerHTML = skeleton;
}

function skeletonHtml(count) {
    const card = `
        <div class="skeleton-card">
            <div class="skeleton-info">
                <div class="skeleton-block"></div>
                <div class="skeleton-block"></div>
                <div class="skeleton-block"></div>
                <div class="skeleton-block"></div>
            </div>
            <div class="skeleton-block skeleton-map"></div>
        </div>
    `;
    return card.repeat(count);
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${m} ${period}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
