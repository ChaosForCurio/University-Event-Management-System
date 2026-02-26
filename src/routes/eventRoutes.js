const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Page Routes
router.get('/', eventController.getHome);
router.get('/dashboard', eventController.getDashboard);
router.get('/my-events', eventController.getMyEvents);
router.get('/create', eventController.getCreateEvent);

// HTMX API Routes
router.post('/htmx/rsvp/:id', eventController.postRSVP);
router.post('/htmx/role', eventController.postRole);
router.post('/htmx/events', eventController.postEvent);
router.delete('/htmx/events/:id', eventController.deleteEvent);

module.exports = router;
