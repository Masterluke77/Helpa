# Helpa on Portainer

Deploying Helpa with Portainer is straightforward using the provided `docker-compose.prod.yml`.

## Prerequisites
- A running Portainer instance.
- A GitHub/GitLab repository containing this project (or a clone).

## Installation Steps

1. **Login to Portainer** and go to your environment (e.g., `local`).
2. Click on **Stacks** -> **Add stack**.
3. Name your stack (e.g., `helpa`).
4. Select **Repository** (Git).
5. Enter the **Repository URL** of this project (e.g., `https://github.com/yourusername/helpa`).
   - If private, enable authentication and provide credentials.
6. In **Compose path**, enter: `docker-compose.prod.yml`.
7. Scroll down to **Environment variables**. You MUST set the following (or use the defaults in the file for testing):
    - `NEXTAUTH_SECRET`: Generate a random string (e.g. `openssl rand -base64 32`).
    - `NEXTAUTH_URL`: The URL where your app will be accessible (e.g., `http://your-server-ip:3000` or `https://helpa.yourdomain.com`).
    - `NEXT_PUBLIC_SOCKET_URL`: The URL for the websocket server (e.g. `http://your-server-ip:3001` or `https://ws.helpa.yourdomain.com`).
    - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google Login.
    - `MAPBOX_TOKEN`: For Maps.
    - `UPLOAD_S3_PUBLIC_URL`: Public address for MinIO (e.g., `http://your-server-ip:9000`).

8. Click **Deploy the stack**.

## Database Setup (First Run)
After deployment, the database will be empty. You need to push the schema and seed data.

1. In Portainer, go to **Containers**.
2. Find the `helpa_web` container (or similar name).
3. Click the **>_ Console** icon (Exec).
4. Click **Connect** (default `/bin/sh` or `/bin/bash` is fine).
5. Run the following commands inside the container:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
   *Note: This might require waiting for Postgres to be fully ready.*

## Access
- **Web App**: `http://your-server-ip:3000`
- **MinIO Console**: `http://your-server-ip:9001`
