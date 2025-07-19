# 📝 Task Tracker Backend

This is the backend system for a Task Tracking and Management Application. It is built with **Node.js**, **Express**, **MongoDB**, and supports features like JWT-based authentication, task assignment, user roles, and real-time notifications via WebSockets.

---

## 🚀 Features

- ✅ User registration and login (JWT-based)
- ✅ Task creation, updating, deleting
- ✅ Assign tasks to users
- ✅ Role-based access control (Admin / User)
- ✅ Project and team management
- ✅ Comments and attachments for tasks
- ✅ WebSocket support for real-time task notifications

---

## ⚙️ Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- WebSocket (`ws`)
- dotenv for environment config
- Postman for API testing

---

## 📂 Project Structure

```
task-tracker-backend/
│
├── config/             # MongoDB config
├── controllers/        # API logic
├── middleware/         # Auth & error middleware
├── models/             # Mongoose schemas
├── routes/             # Route definitions
├── uploads/            # For storing attachments
├── websocket.js        # Real-time notification logic
├── server.js           # Entry point
├── .env                # Environment variables
└── README.md           # Project info
```

---

## 🔐 .env Example

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=your_jwt_secret
```

---

## 📦 Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start server
node server.js
```

The server will run on: `http://localhost:5000`

WebSocket server will run on: `ws://localhost:5050`

---

## 🧪 Testing API

You can use **Postman** or any API client.

### 🔑 Authentication

- **POST** `/api/auth/register` – Create user
- **POST** `/api/auth/login` – Get JWT token

### 📋 Task Routes

- **POST** `/api/tasks/` – Create task
- **GET** `/api/tasks/` – Get all tasks (user/team based)
- **PUT** `/api/tasks/:id` – Update task
- **DELETE** `/api/tasks/:id` – Delete task

---

## ✅ Best Practices Followed

- Clear folder structure
- Clean, readable code
- Use of async/await and error handling middleware
- Proper role-based access checks
- Real-time architecture using WebSocket

---

## 👨‍💻 Author

**Prajwal Waghmode**  
[GitHub Profile](https://github.com/prajwagmode)

---

## 📌 License

This project is licensed under the MIT License.
