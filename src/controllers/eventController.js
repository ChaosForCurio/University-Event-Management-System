const state = require('../models/state');

const getStats = (role) => {
    if (role === 'organizer') {
        return [
            { label: 'Total Events', value: state.events.length, icon: 'calendar', trend: '+2 new' },
            { label: 'Total RSVPs', value: state.events.reduce((acc, ev) => acc + ev.attendees, 0), icon: 'users', trend: '↑ 14%' },
            { label: 'Completion', value: '92%', icon: 'check-circle', trend: 'High' },
            { label: 'Reach', value: '2.4k', icon: 'eye', trend: '↑ 8%' }
        ];
    } else {
        return [
            { label: 'My Tickets', value: state.rsvps.length, icon: 'ticket', trend: 'Active' },
            { label: 'Categories', value: new Set(state.events.filter(e => state.rsvps.includes(e.id)).map(e => e.category)).size, icon: 'layers', trend: 'Diverse' },
            { label: 'Hours Spent', value: state.rsvps.length * 2, icon: 'clock', trend: 'Estimated' },
            { label: 'Rewards', value: '150pts', icon: 'zap', trend: '+20 today' }
        ];
    }
};

exports.getHome = (req, res) => {
    const { search, category } = req.query;
    let filteredEvents = [...state.events];

    if (search) {
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (category && category !== 'All') {
        filteredEvents = filteredEvents.filter(e => e.category === category);
    }

    filteredEvents.sort((a, b) => b.id - a.id);

    if (req.headers['hx-request'] && (search !== undefined || category !== undefined)) {
        return res.render('partials/event-grid', { layout: false, events: filteredEvents, rsvps: state.rsvps });
    }

    res.render('pages/home', {
        view: 'home',
        events: filteredEvents,
        categories: state.categories,
        currentUser: state.currentUser,
        rsvps: state.rsvps,
        searchQuery: search || '',
        selectedCategory: category || 'All'
    });
};

exports.getDashboard = (req, res) => {
    res.render('pages/dashboard', {
        view: 'dashboard',
        currentUser: state.currentUser,
        stats: getStats(state.currentUser.role),
        events: state.events,
        myRSVPs: state.events.filter(e => state.rsvps.includes(e.id)),
        categories: state.categories
    });
};

exports.getMyEvents = (req, res) => {
    res.render('pages/my-events', {
        view: 'my-events',
        currentUser: state.currentUser,
        myRSVPs: state.events.filter(e => state.rsvps.includes(e.id))
    });
};

exports.getCreateEvent = (req, res) => {
    res.render('pages/create', {
        view: 'create',
        currentUser: state.currentUser,
        categories: state.categories
    });
};

exports.postRSVP = (req, res, next) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = state.events.find(e => e.id === eventId);

        if (!event) {
            return res.status(404).render('partials/toast', { layout: false, message: "Event not found", type: "error" });
        }

        let message = "";
        if (state.rsvps.includes(eventId)) {
            state.rsvps = state.rsvps.filter(id => id !== eventId);
            event.attendees--;
            message = "Ticket cancelled";
        } else {
            if (event.capacity && event.attendees >= event.capacity) {
                return res.status(400).render('partials/toast', { layout: false, message: "Sorry, this event is full!", type: "error" });
            }
            state.rsvps.push(eventId);
            event.attendees++;
            message = "Ticket secured!";
        }

        res.render('partials/event-card', { layout: false, event, isRSVPed: state.rsvps.includes(eventId) }, (err, html) => {
            if (err) return next(err);
            const toastHtml = `<div hx-swap-oob="beforeend:#toast-container">` +
                `<div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000); setTimeout(() => $el.remove(), 4500)" class="w-max max-sm">` +
                `<div class="bg-slate-900 border-white/10 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border">` +
                `<div class="bg-indigo-500/20 text-indigo-400 p-2 rounded-xl"><i data-lucide="info" class="w-5 h-5"></i></div>` +
                `<div><div class="text-sm font-bold">${message}</div></div></div></div></div>`;
            res.send(html + toastHtml);
        });
    } catch (err) {
        next(err);
    }
};

exports.postRole = (req, res) => {
    const { role } = req.body;
    state.currentUser.role = role;
    res.header('HX-Redirect', '/');
    res.send();
};

exports.postEvent = (req, res, next) => {
    try {
        const { title, category, date, location, description, capacity, image } = req.body;

        if (!title || !category || !date || !location || !description) {
            throw new Error("Missing required fields");
        }

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();

        const newEvent = {
            id: Date.now(),
            title,
            category,
            date: formattedDate,
            location,
            description,
            attendees: 0,
            capacity: capacity ? parseInt(capacity) : null,
            image: image || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop'
        };

        state.events.unshift(newEvent);
        res.header('HX-Redirect', '/');
        res.send();
    } catch (err) {
        next(err);
    }
};

exports.deleteEvent = (req, res) => {
    const id = parseInt(req.params.id);
    state.events = state.events.filter(e => e.id !== id);
    state.rsvps = state.rsvps.filter(rid => rid !== id);
    res.send('');
};
