# ----- Marsh API (backend) environment variables -----
# Copy to .env for local development. On Render, set these in the dashboard.

# Server
NODE_ENV=development
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/marsh?retryWrites=true&w=majority

# JWT
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

# Cookie signing / session
SESSION_SECRET=replace_with_another_long_random_string

# Google OAuth 2.0 (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Frontend origin(s) allowed to call this API (comma-separated).
# Local dev frontend served on port 3000:
CLIENT_ORIGIN=http://localhost:3000
# Production example:
# CLIENT_ORIGIN=https://marsh-frontend.onrender.com
