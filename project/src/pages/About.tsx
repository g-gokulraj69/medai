import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, Github, Linkedin, ExternalLink } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

const features = [
  { icon: '📋', title: 'Prescription OCR', desc: 'Upload any prescription photo and get complete AI-powered analysis of all medicines, dosages, and instructions.' },
  { icon: '💊', title: 'Medicine Identification', desc: 'Photograph a medicine or search by name to get comprehensive information about uses, side effects, and more.' },
  { icon: '⚠️', title: 'Drug Interactions', desc: 'Check for dangerous interactions between medicines. Get severity ratings and recommendations.' },
  { icon: '🤖', title: 'AI Chat Assistant', desc: 'Ask anything about medicines in any language. Get evidence-based, personalized answers instantly.' },
  { icon: '🌐', title: 'Multi-language', desc: 'Responds in English, Tamil, Hindi, Telugu, Malayalam, and more. Ask in your language, get answers in your language.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your prescriptions are never stored or logged. All analysis happens in real-time and is not retained.' },
];

const techStack = [
  { name: 'React 18', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300' },
  { name: 'TypeScript', color: 'from-blue-700/20 to-blue-800/20 border-blue-700/30 text-blue-200' },
  { name: 'Vite', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300' },
  { name: 'Tailwind CSS', color: 'from-teal-500/20 to-teal-600/20 border-teal-500/30 text-teal-300' },
  { name: 'Framer Motion', color: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-300' },
  { name: 'Claude AI', color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-300' },
  { name: 'React Router', color: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300' },
  { name: 'Lucide React', color: 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-300' },
];

const tabs = ['Prescription', 'Medicine', 'Chat'] as const;
type Tab = typeof tabs[number];

const howToUse: Record<Tab, string[]> = {
  Prescription: [
    '1. Go to the Prescription Analyzer page',
    '2. Click or drag your prescription photo into the upload zone',
    '3. Make sure the photo is clear with good lighting',
    '4. Click "Analyze Prescription" and wait a few seconds',
    '5. Review the complete breakdown of medicines, dosages, and instructions',
  ],
  Medicine: [
    '1. Go to the Medicine Scanner page',
    '2. Choose "Scan Image" to photograph a medicine, or "Search by Name" to type',
    '3. For image: upload a clear photo of the medicine packaging',
    '4. For name: type the medicine name and press Search',
    '5. Get complete info: uses, side effects, dosage, interactions, and cost',
  ],
  Chat: [
    '1. Go to the AI Chat Assistant page',
    '2. Type your question in the chat box (any language)',
    '3. You can also attach a medicine or prescription photo',
    '4. Use Quick Topics in the sidebar for common questions',
    '5. Get detailed, personalized answers powered by Claude AI',
  ],
};

export default function About() {
  const [activeTab, setActiveTab] = useState<Tab>('Prescription');

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          🏥 Portfolio Project
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-5xl sm:text-6xl font-extrabold text-white mb-4">MedAI</motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-xl text-slate-300 mb-3">Medicine Intelligence Platform</motion.p>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="text-slate-500 max-w-xl mx-auto">
          Built as a portfolio project showcasing AI-powered web development with Claude AI and React.
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="flex items-center justify-center gap-3 mt-6">
          <Link to="/prescription" className="btn-primary">Try it now →</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="btn-secondary flex items-center gap-2">
            <Github size={16} /> GitHub
          </a>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Project Overview */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📖 Project Overview</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            MedAI is a comprehensive medicine intelligence platform that harnesses the power of Claude AI (Anthropic) to make medical information accessible to everyone. The platform allows users to upload prescription photos for detailed analysis, identify medicines by scanning packaging or searching by name, and get instant answers to medical questions through an AI chat assistant.
          </p>
          <p className="text-slate-400 leading-relaxed">
            This project demonstrates real-world AI integration, including multi-modal inputs (text + images), multi-language support, and a responsive, production-quality user interface. All analysis is powered by Claude's advanced language and vision capabilities.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-6">✨ Features</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="card p-5 card-hover">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-white mb-6">🛠️ Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map(t => (
              <span key={t.name}
                className={`px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r border ${t.color}`}>
                {t.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 How to Use</h2>
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {tab}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {howToUse[activeTab].map((step, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {step.replace(/^\d+\. /, '')}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Developer Card */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            YN
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-white text-xl font-bold mb-1">Built by [Your Name]</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Full-stack developer passionate about AI-powered applications and modern web development. This project demonstrates AI integration, React development, and real-world health tech application.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
                <Github size={16} /> GitHub <ExternalLink size={12} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
                <Linkedin size={16} /> LinkedIn <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-300 font-semibold mb-2">⚠️ Medical Disclaimer</h3>
              <p className="text-amber-300/70 text-sm leading-relaxed">
                MedAI is for informational and educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor, pharmacist, or healthcare provider before making any medical decisions. Never disregard professional medical advice or delay seeking it because of information provided by this platform.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
