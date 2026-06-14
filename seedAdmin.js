{
  "name": "marsh-backend",
  "version": "1.0.0",
  "description": "Marsh API — secure crypto wallet backend (Express, MongoDB, JWT, Google OAuth).",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed:admin": "node utils/seedAdmin.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["crypto", "wallet", "api", "express", "mongodb", "oauth"],
  "author": "Marsh",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "csurf": "^1.11.0",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "google-auth-library": "^9.14.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
