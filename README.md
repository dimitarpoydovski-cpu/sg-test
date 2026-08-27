# Calendar App

A simple and elegant Node.js calendar application for managing events.

## Features

- 📅 Interactive calendar view
- ➕ Add, view, and delete events
- 📝 Event descriptions and times
- 🎨 Beautiful responsive UI
- 🔄 Real-time updates

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dimitarpoydovski-cpu/sg-test.git
cd sg-test
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
.
├── server.js           # Express server and API routes
├── package.json        # Project dependencies
├── public/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── script.js       # Client-side logic
└── README.md           # This file
```

## API Endpoints

### Calendar
- `GET /api/calendar?year=2026&month=8` - Get calendar data with events

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:date` - Get events for a specific date
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Date Handling:** date-fns
- **Development:** Nodemon

## License

MIT
