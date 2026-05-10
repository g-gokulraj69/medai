import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Sparkles, AlertCircle, RefreshCw, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { callClaude, fileToBase64 } from '../lib/claudeApi';

type State = 'idle' | 'loading' | 'done' | 'error';

const SYSTEM = `You are an expert medical prescription analyst. Analyze the uploaded prescription image thoroughly and respond with a detailed, well-structured markdown report.

Your report must include:
## 📋 Patient & Doctor Information
- Patient name, age, gender (if visible)
- Doctor name, qualification, hospital/clinic, date

## 🏥 Diagnosis
- Primary diagnosis or condition being treated

## 💊 Medicines Prescribed
For each medicine, provide a formatted table or card with:
- Medicine name & generic name
- Dosage, frequency, duration, form (tablet/capsule/syrup)
- When to take (before/after meals, morning/night)
- Purpose/why prescribed
- Important instructions

## ⚠️ Drug Interactions
- Any potential interactions between prescribed medicines
- Severity level (minor/moderate/major)

## 🛡️ Safety Notes
- Allergies to watch for
- Precautions and follow-up instructions

## 📝 Overall Assessment
- Confidence level (High/Medium/Low)
- Any limitations in reading the prescription

If the image is unclear, note what you can read and flag limitations clearly. Always be thorough and accurate.`;

export default function PrescriptionAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setState('idle');
    setResult('');
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setState('idle');
    setResult('');
    setError('');
  };

  const analyze = async () => {
    if (!file) return;
    setState('loading');
    setError('');
    try {
      const { base64, mediaType } = await fileToBase64(file);
      const text = await callClaude({
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Please analyze this prescription in detail and provide a complete report.' },
          ],
        }],
        maxTokens: 2500,
      });
      setResult(text);
      setState('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.');
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FlaskConical size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Prescription Analyzer</h1>
          </div>
          <p className="text-slate-400 ml-13">Upload a prescription photo and get a complete AI-powered analysis in seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }} className="space-y-4">
            <div className="card p-5">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Upload size={16} className="text-emerald-400" /> Upload Prescription
              </h2>
              <ImageUploader
                onFile={handleFile}
                preview={preview}
                onClear={handleClear}
                label="Drop prescription image here"
              />
              <button
                onClick={analyze}
                disabled={!file || state === 'loading'}
                className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
              >
                {state === 'loading' ? (
                  <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles size={16} /> Analyze Prescription</>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="card p-4">
              <h3 className="text-white text-sm font-semibold mb-3">📸 Photo Tips</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {['Good lighting, no shadows', 'Keep prescription flat & unfolded', 'All text must be clearly visible', 'JPG, PNG, WEBP supported'].map(tip => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  This AI analysis is for informational purposes only. Always consult a qualified doctor or pharmacist for medical decisions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}>
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <FlaskConical size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Upload a Prescription</h3>
                  <p className="text-slate-500 text-sm max-w-xs">Your complete AI analysis will appear here — medicines, dosages, interactions, and more.</p>
                </motion.div>
              )}

              {state === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card h-full min-h-[400px] flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FlaskConical size={20} className="text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Analyzing with AI...</p>
                    <p className="text-slate-500 text-sm mt-1">Reading prescription details</p>
                  </div>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card p-6 border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold mb-1">Analysis Failed</p>
                      <p className="text-red-300 text-sm">{error}</p>
                      <button onClick={() => setState('idle')} className="mt-3 text-sm text-slate-400 hover:text-white transition-colors">← Try again</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {state === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 text-sm font-medium">Analysis Complete</span>
                    </div>
                    <button onClick={handleClear} className="text-xs text-slate-500 hover:text-white transition-colors border border-white/10 px-3 py-1 rounded-lg">
                      New Analysis
                    </button>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <MarkdownRenderer content={result} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
