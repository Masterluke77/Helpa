# Helpa - Standalone Version

A minimal, single-container version of Helpa with:
- **SQLite Database** (Local users & requests)
- **Image Uploads** (Local filesystem)
- **Authentication** (Register/Login with JWT)
- **No external dependencies** (No Postgres, No Redis, No MinIO)

## Running Locally

1. Install dependencies:
   ```bash
   cd stand-alone
   npm install
   ```
2. Start server:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3020`

## Running with Docker / Portainer

1. **Deploy Stack** in Portainer.
2. **Select Repository**: Point to this repo.
3. **Compose Path**: `stand-alone/docker-compose.yml`
4. **Deploy**.

The app will be available on port **3020** (configurable in docker-compose).
Data (uploads & database) is persisted in the volume mount.
