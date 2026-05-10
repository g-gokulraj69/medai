import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, FlaskConical, ScanLine, MessageSquare,
  ShieldCheck, Zap, Brain, ArrowRight, ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

const features = [
  {
    icon: FlaskConical,
    title: 'Prescription Analyzer',
    desc: 'Upload any prescription photo. Our AI reads, interprets, and explains every medicine with dosages, interactions, and warnings.',
    href: '/prescription',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Image AI',
  },
  {
    icon: ScanLine,
    title: 'Medicine Scanner',
    desc: 'Photograph a medicine or search by name to get a comprehensive breakdown of uses, side effects, contraindications, and more.',
    href: '/scanner',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Scan & Search',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    desc: 'Ask anything about medicines, symptoms, or health. Our AI assistant provides personalized, evidence-based answers.',
    href: '/chat',
    color: 'from-orange-500 to-amber-500',
    badge: 'Conversational',
  },
];

const stats = [
  { value: '10K+', label: 'Medicines Covered' },
  { value: '99%', label: 'Accuracy Rate' },
  { value: '<2s', label: 'Analysis Time' },
  { value: '24/7', label: 'Always Available' },
];

const trustPoints = [
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Your prescriptions are never stored. All analysis happens in real-time.' },
  { icon: Zap, title: 'Instant Results', desc: 'Powered by Claude AI for lightning-fast, accurate medical information.' },
  { icon: Brain, title: 'Clinical Grade', desc: 'Trained on comprehensive medical databases and clinical guidelines.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-teal-500/8 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
          >
            <Activity size={14} />
            Powered by Claude AI · Anthropic
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
          >
            Medicine Intelligence
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              at Your Fingertips
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload prescriptions, scan medicines, or ask our AI — get instant, comprehensive,
            clinical-grade information about any medication.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/prescription"
              className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              Analyze Prescription
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <MessageSquare size={17} />
              Chat with AI
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-slate-500 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Three Powerful Tools</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Everything you need to understand medications and stay safe</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, href, color, badge }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
              >
                <Link
                  to={href}
                  className="group block h-full p-6 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/20 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{badge}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
                  <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Get Started <ChevronRight size={15} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for Trust & Accuracy</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Medical AI you can rely on, with safeguards you can count on</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustPoints.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to understand your medicines?
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Start with a prescription, scan a medicine, or just ask a question. MedAI is here 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/prescription"
                className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-cyan-500/20"
              >
                Analyze Prescription <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/scanner"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <ScanLine size={17} />
                Scan Medicine
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-slate-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity size={14} className="text-cyan-500/50" />
          <span className="text-slate-500 font-medium">MedAI</span>
        </div>
        <p>For informational purposes only. Always consult a qualified healthcare professional.</p>
      </footer>
    </div>
  );
}
