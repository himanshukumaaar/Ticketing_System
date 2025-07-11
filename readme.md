# 🎫 Ticketing System

Hey! 👋  
Welcome to my **Ticketing System** project — a simple web app where users can raise support tickets and admins can manage them. Built to learn and practice TypeScript, JavaScript, and backend integration with **Supabase**. 🚀

---

## 💡 Features

- 📝 Users can create support tickets  
- 📄 View all submitted tickets in a table  
- ✏️ Update ticket status (e.g., Open, In Progress, Resolved)  
- 🔐 Basic login/logout using Supabase Auth  
- 📦 Real-time database powered by Supabase  

---

## ⚙️ Tech Stack

| 🔧 Technology | 💬 Description |
|---------------|----------------|
| **TypeScript** | Strongly typed JavaScript for better structure |
| **JavaScript** | Used for client-side logic |
| **Supabase** | Backend: Auth + Realtime Database (PostgreSQL) |
| **HTML/CSS** | Basic frontend structure and styling |
| **Vite** or **Parcel** *(if used)* | Fast dev environment *(optional)* |

---

## 🚀 Getting Started

### 1. **Clone the repo**
```bash
git clone https://github.com/himanshukumaaar/Ticketing_System.git
cd Ticketing_System
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Set up Supabase**
- Go to [supabase.com](https://supabase.com) and create a free project
- Get your:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- Create a table called `tickets` with fields like:
  - `id` (UUID)
  - `title` (text)
  - `description` (text)
  - `status` (text)
  - `created_at` (timestamp)
- Enable **Row Level Security (RLS)** and add policies as needed

### 4. **Create `.env` file**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5. **Run the app**
```bash
npm run dev
```

Now go to [http://localhost:5173](http://localhost:5173) ✨

---

## 🔮 Future Plans

- [ ] Add user roles (Admin vs User)
- [ ] Upload attachments to Supabase storage
- [ ] Better UI/UX with a component library (like Tailwind or Chakra UI)
- [ ] Add filters/search for ticket list
- [ ] Email notifications on ticket updates

---

## 🙋 Why I Made This

> "I wanted to learn how to use Supabase with TypeScript & JavaScript in a real-world project."

This was a great way to practice:
- 🧠 Authentication
- 🧱 Database CRUD
- 🛠️ Type safety with TypeScript
- 🌐 Connecting frontend to backend easily

---

## 📬 Connect With Me

If you have any questions or want to collaborate:
- 💌 Email: yourmail@example.com
- 🧑‍💻 GitHub: [@himanshukumaaar](https://github.com/himanshukumaaar)
- 💼 LinkedIn: [Your Profile](https://linkedin.com/in/yourname)

---

## ⭐ Like This Project?

Leave a ⭐ if you found it helpful or inspiring!  
Let’s grow and build cool stuff together! 🙌