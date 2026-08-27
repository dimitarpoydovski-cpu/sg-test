let currentDate = new Date();

// DOM Elements
const monthYearEl = document.getElementById('monthYear');
const calendarDaysEl = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const eventForm = document.getElementById('eventForm');
const eventTitleEl = document.getElementById('eventTitle');
const eventDateEl = document.getElementById('eventDate');
const eventTimeEl = document.getElementById('eventTime');
const eventDescEl = document.getElementById('eventDesc');
const eventsListEl = document.getElementById('eventsList');

// Initialize
loadCalendar();
loadEvents();

// Event Listeners
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  loadCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  loadCalendar();
});

eventForm.addEventListener('submit', addEvent);

// Functions
function loadCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  fetch(`/api/calendar?year=${year}&month=${month}`)
    .then(res => res.json())
    .then(data => {
      monthYearEl.textContent = `${data.monthName} ${data.year}`;
      renderCalendarDays(data);
    })
    .catch(err => console.error('Error loading calendar:', err));
}

function renderCalendarDays(data) {
  calendarDaysEl.innerHTML = '';
  const eventsByDate = {};

  data.events.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  data.calendarDays.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';

    if (day === null) {
      dayEl.className += ' empty';
    } else {
      dayEl.textContent = day;
      const dateStr = `${data.year}-${String(data.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (eventsByDate[dateStr]) {
        dayEl.classList.add('has-event');
      }

      const today = new Date();
      if (
        day === today.getDate() &&
        data.month === today.getMonth() &&
        data.year === today.getFullYear()
      ) {
        dayEl.classList.add('today');
      }

      dayEl.addEventListener('click', () => {
        eventDateEl.value = dateStr;
        eventTitleEl.focus();
      });
    }

    calendarDaysEl.appendChild(dayEl);
  });
}

function loadEvents() {
  fetch('/api/events')
    .then(res => res.json())
    .then(events => {
      renderEventsList(events);
    })
    .catch(err => console.error('Error loading events:', err));
}

function renderEventsList(events) {
  if (events.length === 0) {
    eventsListEl.innerHTML = '<div class="event-item empty">No events yet. Create one!</div>';
    return;
  }

  const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

  eventsListEl.innerHTML = sortedEvents
    .map(
      event => `
    <div class="event-item">
      <div class="event-details">
        <h4>${event.title}</h4>
        <div>
          <span class="event-date">${event.date}</span>
          <span class="event-time">@ ${event.time}</span>
        </div>
        ${event.description ? `<div class="event-desc">${event.description}</div>` : ''}
      </div>
      <button class="btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
    </div>
  `
    )
    .join('');
}

function addEvent(e) {
  e.preventDefault();

  const newEvent = {
    title: eventTitleEl.value,
    date: eventDateEl.value,
    time: eventTimeEl.value,
    description: eventDescEl.value
  };

  fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEvent)
  })
    .then(res => res.json())
    .then(data => {
      eventForm.reset();
      eventTimeEl.value = '09:00';
      loadCalendar();
      loadEvents();
    })
    .catch(err => console.error('Error adding event:', err));
}

function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    fetch(`/api/events/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        loadCalendar();
        loadEvents();
      })
      .catch(err => console.error('Error deleting event:', err));
  }
}
