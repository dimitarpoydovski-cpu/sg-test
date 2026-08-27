const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getYear, getMonth, getDaysInMonth, startOfMonth, format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory event storage
let events = [
  {
    id: 1,
    title: 'Team Meeting',
    date: '2026-09-05',
    time: '10:00',
    description: 'Weekly team sync'
  },
  {
    id: 2,
    title: 'Project Deadline',
    date: '2026-09-15',
    time: '17:00',
    description: 'Final submission date'
  }
];

let eventId = 3;

// Routes

// Get calendar data for a specific month
app.get('/api/calendar', (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth();

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDay = startOfMonth(new Date(year, month));
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  res.json({
    year,
    month,
    monthName: format(new Date(year, month), 'MMMM'),
    daysInMonth,
    calendarDays,
    events: events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    })
  });
});

// Get all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Get events for a specific date
app.get('/api/events/:date', (req, res) => {
  const { date } = req.params;
  const dateEvents = events.filter(e => e.date === date);
  res.json(dateEvents);
});

// Create a new event
app.post('/api/events', (req, res) => {
  const { title, date, time, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  const newEvent = {
    id: eventId++,
    title,
    date,
    time: time || '09:00',
    description: description || ''
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update an event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, time, description } = req.body;

  const event = events.find(e => e.id === parseInt(id));
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (title) event.title = title;
  if (date) event.date = date;
  if (time) event.time = time;
  if (description !== undefined) event.description = description;

  res.json(event);
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const index = events.findIndex(e => e.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const deletedEvent = events.splice(index, 1);
  res.json(deletedEvent[0]);
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Calendar app running on http://localhost:${PORT}`);
});
