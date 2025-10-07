# 🥧 Pie Tracker

A self-contained mince pie taste testing application designed to help teams collaboratively rate and track mince pie tastings. Features a public leaderboard with an admin interface for submitting reviews.

## Features

- **Public Leaderboard**: View all pies ranked by average scores
- **Multi-criteria Rating**: Rate pies on Filling, Pastry, Appearance, and Overall quality (1-5 stars)
- **User Management**: Admin can create reviewer accounts
- **Responsive Design**: Mobile-first design with dark/light mode
- **PWA Support**: Install on mobile devices as a native-like app
- **Self-Contained**: Single Docker container with SQLite database

## Technology Stack

- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: React, Tailwind CSS, React Router
- **Build Tool**: Vite
- **Authentication**: bcrypt, express-session
- **Deployment**: Docker

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Or build and run manually:**
   ```bash
   docker build -t pie-tracker .
   docker run -d -p 9993:9993 -v $(pwd)/data/db:/db pie-tracker
   ```

3. **Access the app:**
   - Open http://localhost:9993
   - Create your admin account on first boot
   - Start adding pies and reviews!

### For Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   # Terminal 1 - Start backend
   npm start

   # Terminal 2 - Start frontend dev server
   npm run dev
   ```

3. **Access the app:**
   - Frontend: http://localhost:5173 (with hot reload)
   - Backend API: http://localhost:9993

## Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

- `PORT`: Server port (default: 9993)
- `DB_PATH`: SQLite database path (default: ./db/pietracker.db)
- `SESSION_SECRET`: Secret for session encryption (CHANGE IN PRODUCTION!)
- `NODE_ENV`: Environment (development/production)

### Volume Mapping (Docker)

- `/db`: Database storage directory
  - Maps to `./data/db` in docker-compose
  - Database file: `pietracker.db`

### Port Configuration

- Default port: **9993**
- Can be changed via `PORT` environment variable
- Update docker-compose.yml ports mapping if needed

## First-Time Setup

1. **Access the application** for the first time
2. **Setup page** appears automatically
3. **Create admin account** with username and password
4. **Login** with your admin credentials
5. **Start adding pies** and creating reviewer accounts

## Usage Guide

### Admin Dashboard

Admins can:
- Add new pies to the system
- Review pies they haven't reviewed yet
- Create new user accounts (admin or reviewer)

### Reviewing Pies

1. Go to Dashboard → Review Pies
2. Click on any unreviewed pie
3. Rate on 4 criteria (1-5 stars each):
   - Filling
   - Pastry
   - Appearance
   - Overall Rating
4. Submit review
5. View results on the public leaderboard

### User Management

Admins can create new users:
1. Go to Users page
2. Click "Create New User"
3. Enter username and password
4. Choose role (Admin or Reviewer)
5. New user can login and start reviewing

### Public Leaderboard

- Accessible to everyone (no login required)
- Shows all pies ranked by average overall score
- Displays individual category scores
- Shows each reviewer's ratings
- Auto-refreshes every 30 seconds

## PWA Installation

### On Mobile (iOS/Android)

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" or "Install App"
3. Confirm installation
4. App appears as icon on home screen
5. Opens as full-screen app

### Features When Installed

- Works offline (with cached data)
- Full-screen experience
- Fast loading
- Native-like feel

## API Endpoints

### Authentication
- `POST /api/auth/register-first-admin` - Create first admin user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check session
- `GET /api/auth/setup-needed` - Check if setup needed

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

### Pies
- `GET /api/pies` - Get all pies (public)
- `POST /api/pies` - Create new pie (auth required)
- `GET /api/pies/:id` - Get single pie with reviews (public)
- `GET /api/pies/:id/can-review` - Check if user can review (auth required)

### Reviews
- `POST /api/reviews` - Submit review (auth required)
- `GET /api/reviews/my-reviews` - Get user's reviews (auth required)
- `GET /api/reviews/leaderboard` - Get leaderboard data (public)

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password_hash`: Bcrypt hashed password
- `is_admin`: Boolean flag
- `created_at`: Timestamp

### Pies Table
- `id`: Primary key
- `name`: Pie name
- `created_by`: User ID (foreign key)
- `created_at`: Timestamp

### Reviews Table
- `id`: Primary key
- `pie_id`: Pie ID (foreign key)
- `user_id`: User ID (foreign key)
- `filling_score`: 1-5 rating
- `pastry_score`: 1-5 rating
- `appearance_score`: 1-5 rating
- `overall_score`: 1-5 rating
- `created_at`: Timestamp
- Unique constraint on (pie_id, user_id)

## Deployment

### Unraid App Store

Template configuration:
```xml
Name: Pie Tracker
Repository: your-docker-hub-username/pie-tracker
Port: 9993 (Container) → 9993 (Host)
Volume: /db → /mnt/user/appdata/pie-tracker/db
Environment:
  - SESSION_SECRET: (generate random string)
  - NODE_ENV: production
```

### General Docker Deployment

```bash
docker run -d \
  --name pie-tracker \
  -p 9993:9993 \
  -v /path/to/data:/db \
  -e SESSION_SECRET="your-secret-here" \
  -e NODE_ENV=production \
  --restart unless-stopped \
  pie-tracker
```

## Troubleshooting

### Database Issues

**Problem**: Database errors on startup
- **Solution**: Check /db directory permissions
- Ensure volume is properly mapped
- Check DB_PATH environment variable

### Port Conflicts

**Problem**: Port 9993 already in use
- **Solution**: Change port mapping in docker-compose.yml
- Or set PORT environment variable

### Session/Login Issues

**Problem**: Can't stay logged in
- **Solution**: Set SESSION_SECRET environment variable
- Use a long, random string
- Ensure cookies are enabled in browser

### Build Failures

**Problem**: Docker build fails
- **Solution**: Check Node.js version (requires 20+)
- Ensure enough disk space
- Check network connectivity for npm install

## Development

### Project Structure

```
pietracker/
├── server/              # Backend
│   ├── db/             # Database layer
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── index.js        # Server entry point
├── client/             # Frontend
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── styles/     # CSS files
│   │   └── utils/      # Utilities
│   └── index.html
├── db/                 # SQLite database (gitignored)
├── Dockerfile          # Docker build config
└── docker-compose.yml  # Docker Compose config
```

### Adding Features

1. **Backend changes**: Edit files in `server/`
2. **Frontend changes**: Edit files in `client/src/`
3. **Database changes**: Update `server/db/init.js` and queries
4. **Rebuild**: `npm run build` or rebuild Docker image

## Security Considerations

- Passwords are hashed with bcrypt (10 rounds)
- Sessions use httpOnly cookies
- SQL injection protected by parameterized queries
- Input validation on all endpoints
- **Change SESSION_SECRET in production!**

## License

ISC

## Contributing

Contributions welcome! Please open an issue or pull request.

## Support

For issues and questions, please open a GitHub issue.

---

Made with ❤️ and 🥧
