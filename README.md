# Restaurant Management System

This is a simple Restaurant Management System built using the MERN stack for a college mini project.

## Features
- Manage menu items
- Add, update, and delete food items
- Manage customer orders
- View total menu items and total orders on the dashboard
- Simple Bootstrap-based user interface

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Mongoose
- Bootstrap 5
- Axios

## Project Structure
```text
restaurant-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
├── .gitignore
└── package-lock.json
```

## MongoDB Setup
1. Install MongoDB locally.
2. Start MongoDB.
3. Use the following connection string:
   `mongodb://127.0.0.1:27017/restaurant_management`

## Backend Installation
```bash
cd backend
npm install
npm run dev
```

## Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

## How to Run the Project
1. Start the backend server from the backend folder.
2. Start the frontend server from the frontend folder.
3. Open the frontend URL: http://localhost:5173
4. Backend API runs at: http://localhost:5000

## API Endpoints
### Menu
- GET /api/menu
- POST /api/menu
- PUT /api/menu/:id
- DELETE /api/menu/:id

### Orders
- GET /api/orders
- POST /api/orders
- PUT /api/orders/:id
- DELETE /api/orders/:id

## Notes
This project is intentionally simple and suitable for a college mini project.
This project is developed using the MERN stack.
