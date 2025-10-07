# 🥧 Pie Tracker - Quick Start Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   # Build frontend
   npm run build

   # Start server
   npm start
   ```

3. **Access the app:**
   - Open http://localhost:9993
   - Create admin account on first visit
   - Start tracking pies!

## Docker Deployment

### Option 1: Docker Compose (Easiest)

```bash
docker-compose up -d
```

### Option 2: Docker Build & Run

```bash
# Build image
docker build -t pie-tracker .

# Run container
docker run -d \
  --name pie-tracker \
  -p 9993:9993 \
  -v $(pwd)/data/db:/db \
  -e SESSION_SECRET="your-random-secret-here" \
  pie-tracker
```

### Option 3: Pull from Registry (when published)

```bash
docker pull your-username/pie-tracker:latest
docker run -d -p 9993:9993 -v ./data:/db your-username/pie-tracker
```

## First Time Setup

1. Navigate to http://localhost:9993
2. You'll be redirected to the setup page
3. Create your admin account
4. Login and start adding pies!

## Usage

### As Admin:
- **Add pies**: Dashboard → Add New Pie
- **Review pies**: Dashboard → Review Pies
- **Create users**: Users → Create New User

### As Reviewer:
- **Review pies**: Dashboard → Review Pies

### Everyone:
- **View leaderboard**: Main page (no login required)

## Environment Variables

Optional configuration (create `.env` file):

```env
PORT=9993
DB_PATH=/db/pietracker.db
SESSION_SECRET=change-this-to-a-random-string
NODE_ENV=production
```

## Troubleshooting

**Port already in use?**
- Change port: `PORT=8080 npm start`
- Or edit docker-compose.yml

**Can't login?**
- Check browser cookies are enabled
- Set SESSION_SECRET environment variable

**Database errors?**
- Ensure `/db` directory exists
- Check volume permissions in Docker

## Tech Stack

- Backend: Node.js + Express + SQLite
- Frontend: React + Tailwind CSS
- Deployment: Docker

## Need Help?

See [README.md](./README.md) for full documentation.
