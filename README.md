# CollabCode Panel

Real-time collaborative code editor built with React, Express, and Socket.IO.

**Author:** Halit Altun  
**Repository:** https://github.com/halit-altun/CollabCode.git

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/halit-altun/CollabCode.git
   cd CollabCode
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `example.env` to `.env` and set:

   - `REACT_APP_BACKEND_URL` — Socket.IO server URL (e.g. `http://localhost:5000` for local dev)
   - `SERVER_PORT` — backend port (default `5000`)

4. Development: run the React app and server in separate terminals:

   ```bash
   npm start
   ```

   ```bash
   npm run server:dev
   ```

5. Production build: build the client, then serve with Node:

   ```bash
   npm run build
   npm run server:prod
   ```

## Docker

See `Dockerfile` and `docker-compose.yml`. Adjust image name and environment variables for your deployment.

## License

See [LICENSE](LICENSE).
