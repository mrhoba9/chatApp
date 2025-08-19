# 🧩 Simple Chat App (Learning Project)

A simple **real-time chat application** built as a learning project.  
It demonstrates:  
- 🔄 **Real-time messaging** with [Socket.IO](https://socket.io/)  
- 🔐 **Authentication** with [JWT](https://jwt.io/)  
- 📂 **Friend system** and private chats  

---

## 🔐 Authentication Flow

### Sign In
- User enters **Private Key**
- Backend verifies and returns:
  - ✅ JWT Token  
  - ✅ Public Key  
  - ✅ Friends List  
- ❌ On failure → `"Invalid private key"`

### Sign Up
- Backend generates:
  - ✅ Public Key + Private Key  
- App displays credentials + **Sign In** button  
- User signs in using generated private key  

---

## 👥 Friend System

### ➕ Add Friend
- Input: Friend’s **Public Key**
- Action: `"Send Friend Request"`
- Response:
  - ✅ `"Friend request sent"`
  - ❌ `"Invalid public key"` | `"Already friends"` | `"Network error"`

### ✅ Accept Request
- On acceptance → both users added to each other’s friend list → **chat enabled**  
- On rejection/revocation → request removed → **no chat allowed**  

---

## 💬 Chat System (Socket.IO)

- **Start Chat** → click on a friend to open chat window  
- **Load Messages**  
  - ✅ Show history if available  
  - ❌ `"No messages yet"` if none  
- **Messaging (real-time)**  
  - Instant delivery via Socket.IO  
  - Optional features:  
    - `"typing..."` indicators  
    - Message read status  

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express, Socket.IO  
- **Auth:** JWT (JSON Web Token)  
- **Database:** MongoDB  

---

## 📌 Repository
🔗 [View the full project on GitHub](https://github.com/mrhoba9/chatApp)

---

## 📝 Notes

⚠️ **This project is for learning purposes only.**  
It is **not intended for production use**.  

👨‍💻 Made by **Ahmed Ehab**

---

## ⚙️ How to Run the Project

```bash
# 1. Clone the repository
git clone https://github.com/mrhoba9/chatApp.git

# 2. Navigate to the project
cd chatApp

# 3. Install dependencies (root if needed)
npm install

# 4. Build the project
npm run build

# 5. Navigate to backend folder
cd backend

# 6. Install backend dependencies
npm install

# 7. Start the backend server
npm start
