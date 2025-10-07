# 🥧 Pie Score

A self-contained mince pie taste testing application designed to help teams collaboratively rate and track mince pie tastings. Features a public leaderboard with an admin interface for submitting reviews.

<div align="center">

### First Run Setup
<img src="https://raw.githubusercontent.com/ajb3932/famli/main/frontend/public/images/famli-first_run.jpg" title="First Run Setup" style="max-width:100%;" width="800" />
![piescore](https://github.com/user-attachments/assets/dfe24fef-7584-4798-9959-c39ad0158f50)

</div>

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   ```
   services:
      piescore:
         container-name: piescore
         hostname: piescore
         image: ajb3932/piescore:latest
         ports:
         - "9993:9993"
         volumes:
         - ./data/db:/db
         environment:
         - NODE_ENV=production
         - SESSION_SECRET=change-me-in-production-please-use-random-string
         - DB_PATH=/db/piescore.db
         - PORT=9993
         restart: unless-stopped
   ```

2. **Or build and run manually:**
   ```bash
   docker build -t piescore .
   docker run -d -p 9993:9993 -v $(pwd)/data/db:/db piescore
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

## Contributing

Contributions welcome! Please open an issue or pull request.

## Support

For issues and questions, please open a GitHub issue.

---

Made with ❤️ and 🥧
