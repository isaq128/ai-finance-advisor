💼 AI Financial Advisor App

Smart Financial Insights Powered by AI

🧠 Overview

The AI Financial Advisor App is an intelligent, web-based assistant that analyzes user financial data and provides personalized financial recommendations in real time.
It leverages Generative AI and Large Language Models (LLMs) to help users track spending, optimize savings, and plan investments through an interactive dashboard.

🚀 Features

✅ Expense Analysis – Understand where your money goes.
✅ AI-Powered Advice – Get personalized saving and budgeting suggestions.
✅ Smart Categorization – Automatically groups expenses and transactions.
✅ Visual Insights – Interactive charts & analytics.
✅ Fast & Secure – Real-time data handling and privacy-focused design.

🧩 Tech Stack

Frontend: Next.js, Tailwind CSS, Framer Motion
Backend: Python (FastAPI)
AI Integration: OpenRouter API (for LLM-based insights)
Database: Supabase / SQLite
Deployment: Vercel / Render
Version Control: Git & GitHub

⚙️ How It Works

1️⃣ User Input: Users enter their income, expenses, or upload a CSV of transactions.
2️⃣ Data Processing: Backend (Python + FastAPI) structures and cleans the data.
3️⃣ AI Analysis: OpenRouter API analyzes trends and generates tailored recommendations.
4️⃣ Results Display: Frontend visualizes data and insights through animated dashboards.

🧠 Example Output

💬 “You spent ₹2,800 on online food orders last month. Cutting it by 20% could save you ₹560 monthly.”
💬 “Your utility expenses are consistent — consider an automated saving goal of ₹5,000/month.”

💡 Key Learnings

Improved LLM prompt design for numerical reasoning tasks.

Integrated AI + financial data workflows seamlessly.

Deployed a full-stack AI-driven FinTech application end-to-end.

🛠️ Setup Instructions
1. Clone the Repository
git clone https://github.com/isaq128/ai-financial-advisor-app.git
cd ai-financial-advisor-app

2. Install Dependencies

Frontend (Next.js):

npm install


Backend (Python):

pip install -r requirements.txt

3. Set Environment Variables

Create a .env file and add:

OPENROUTER_API_KEY=your_api_key  
SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_supabase_key

4. Run the Application

Backend:

uvicorn main:app --reload


Frontend:

npm run dev


Then visit: http://localhost:3000

🌐 Deployment

Frontend: Deployed on Vercel

Backend: Hosted on Render / Railway

Database: Managed via Supabase

👨‍💻 Author

Mohammed Isaq
AI Engineer Intern @ Orants AI
🔗 LinkedIn

💻 GitHub

🧩 License

This project is licensed under the MIT License — feel free to modify and improve it.
