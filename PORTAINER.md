# Helpa on Portainer (Easy Setup)

Deploy Helpa easily. By default, it will use **Port 3010** (Web) and **Port 3011** (Chat) to avoid conflicts with port 3000.

## Installation Steps

1. **Login to Portainer**.
2. Go to **Stacks** -> **Add stack**.
3. Name it `helpa`.
4. Select **Repository** and enter your repo URL (e.g. `https://github.com/yourusername/helpa`).
   - *Compose path*: `docker-compose.prod.yml`
5. **Environment Variables**:
   You can leave everything default for a quick test! The app will start at `http://your-server-ip:3010`.
   
   **For a real setup**, set these:
   - `NEXTAUTH_SECRET`: Random string (e.g. `complex_password_123`)
   - `NEXTAUTH_URL`: `http://your-server-ip:3010` (Change IP to match your server)
   - `NEXT_PUBLIC_SOCKET_URL`: `http://your-server-ip:3011`
   - `UPLOAD_S3_PUBLIC_URL`: `http://your-server-ip:9000` (for images)

6. Click **Deploy the stack**.

## Changing Ports?
If 3010 is also taken, just add these environment variables in Portainer:
- `WEB_PORT`: `4000` (or whatever you want)
- `SOCKET_PORT`: `4001`
- `NEXTAUTH_URL`: `http://your-server-ip:4000`

## Initialize Database (One time)
1. Go to **Containers** in Portainer.
2. Find the `helpa_web` container.
3. Click the **>_ Console** button -> **Connect**.
4. Run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
   
**Done!** Access your app at `http://your-server-ip:3010`.
