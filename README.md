# 🏥 MedAI — Medicine Intelligence Platform

> AI-powered medicine intelligence platform. Analyze prescriptions, identify medicines, and get instant health answers.

![MedAI](https://img.shields.io/badge/MedAI-Medicine%20Intelligence-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-teal?style=flat-square&logo=tailwindcss)

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Prescription Analyzer | Upload prescription photos for complete AI analysis |
| 💊 Medicine Scanner | Identify medicines by image or search by name |
| 🤖 AI Chat Assistant | Ask anything about medicines in any language |
| 🌐 Multi-language | English, Tamil, Hindi, Telugu, and more |
| 🔒 Privacy First | No data stored, real-time analysis only |

## 🚀 Live Demo

🔗 [View Live](https://medai.vercel.app) *(replace with your deployment URL)*

## 🛠 Tech Stack

- **React 18** + TypeScript
- **Vite** — lightning fast build tool
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **React Router v6** — client-side routing
- **Groq AI** (Llama 3.3 70B) — AI backend
- **Lucide React** — icons

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ImageUploader.tsx
│   └── MarkdownRenderer.tsx
├── pages/
│   ├── Home.tsx
│   ├── PrescriptionAnalyzer.tsx
│   ├── MedicineScanner.tsx
│   ├── ChatAssistant.tsx
│   └── About.tsx
├── lib/
│   └── claudeApi.ts
├── App.tsx
└── main.tsx
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- Free Groq API key from [console.groq.com](https://console.groq.com)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/medai.git
cd medai

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your Groq API key to .env
# VITE_GROQ_API_KEY=your_key_here

# 5. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variable: `VITE_GROQ_API_KEY` = your key
4. Deploy!

## ⚠️ Medical Disclaimer

MedAI is for **educational purposes only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.

## 📄 License

MIT © 2025 MedAI
