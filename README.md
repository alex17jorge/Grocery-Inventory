# Grocery Inventory

A full-stack grocery inventory app for tracking household items, quantities, stock levels, categories, and expiry dates.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- HTTP client: Axios

## Features

- Add grocery items with category, quantity, threshold, and expiry date
- Update or delete existing items
- Prevent duplicate item names
- Filter items by category and stock status
- View stock summary counts and category percentages
- Mark items as In Stock, Low Stock, or Out of Stock

## Project Structure

- `client/` — React frontend
- `server/` — Express and MongoDB backend

## Prerequisites

- Node.js
- npm
- MongoDB connection string

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/alex17jorge/Grocery-Inventory.git
cd Grocery-Inventory
```

### 2. Install dependencies

```bash
cd client
npm install
cd ..\server
npm install
```

### 3. Configure environment variables

Create `server/.env` with:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

## Run the app

### Start the backend

```bash
cd server
node server.js
```

For development with auto-reload:

```bash
npx nodemon server.js
```

### Start the frontend

In a new terminal:

```bash
cd client
npm run dev
```

The frontend runs on Vite's default local URL, and the backend runs on `http://localhost:3001`.

## API Endpoints

- `GET /items` — list all items
- `POST /items` — create an item
- `PUT /items/:id` — update an item
- `DELETE /items/:id` — delete an item

## Scripts

### Client

- `npm run dev` — start Vite dev server
- `npm run build` — build production frontend
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

### Server

- `node server.js` — start backend
- `npx nodemon server.js` — start backend with auto-reload

## Notes

- `node_modules/` is intentionally ignored and should not be committed.
- `server/.env` is intentionally ignored and should stay local.
- The backend expects `MONGODB_URI` to be defined before startup.
