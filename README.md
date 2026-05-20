## Setup
1. Clone the repo
2. `cd server && cp .env.example .env` (fill in your values)
3. `npm install && npm run dev`
4. `cd ../client && npm install && npm run dev`

## Dependencies
- React, Vite, Zustand, Axios, React Router
- Express, Mongoose, bcryptjs, jsonwebtoken

## Features
- Full CRUD for issues
- JWT authentication
- Debounced search + filter + pagination
- Status/priority badges + dashboard counts
- CSV/JSON export
