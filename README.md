# Authorization Server for TB or not TB

Provides Signup and login functionality, sessions maintained using JWT.

## Project Structure
- /models - Database models for mongoose.
- /routes - API routes.
- /middleware - Handlers to use while processing requests.
- config.js - Imports environment variables from .env and makes them available.
- index.js - Main js file.
## Environment Variables
- ``` JWT_SECRET ```: Secret used for encrypting/decrypting JWT's
- ``` MONGO_DB_URI ```: URI of mongoDB cluster used for storing users.

## Setup
- ``` git clone <this repo> ```
- ``` npm install ```
- Create a .env file with the above specified variables.
- (If you don't have a mongoDB database, set one up)
- ``` npm start ```
