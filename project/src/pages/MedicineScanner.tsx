import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Search, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { callClaude, fileToBase64 } from '../lib/claudeApi';

type Mode = 'image' | 'search';
type State = 'idle' | 'loading' | 'done' | 'error';

const QUICK_CHIPS = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Omeprazole', 'Atorvastatin', 'Cetirizine', 'Ibuprofen', 'Pantoprazole'];

const IMAGE_SYSTEM = `You are an expert pharmacist. Analyze this medicine image and provide a comprehensive, well-formatted markdown report covering:

## 💊 Medicine Identification
- Brand name, generic name, manufacturer
- Type, strength, composition

## 📋 Prescription Status
- Whether prescription is required
- Drug schedule/class

## 🎯 Uses & Mechanism
- Primary and secondary uses (bulleted list)
- How the medicine works

## 📏 Dosage Guide
| Patient Type | Dose | Frequency |
|---|---|---|
Provide standard doses for adults, children, elderly. Include max daily dose.

## ⚠️ Side Effects
**Very Common:** list
**Common:** list  
**Uncommon:** list
**Serious (seek help immediately):** list

## 🛡️ Safety Information
- Precautions and contraindications
- Drug interactions (other medicines to avoid)
- Food and alcohol interactions

## 👶 Special Populations
- Pregnancy safety rating
- Breastfeeding guidance
- Elderly considerations
- Effect on driving

## 💰 Storage & Cost
- Storage conditions and shelf life
- Approximate price in India
- Generic alternatives available

Always be thorough and accurate. Include a medical disclaimer at the end.`;

const TEXT_SYSTEM = `You are an expert pharmacist. Provide comprehensive information about the requested medicine in well-formatted markdown. Cover all aspects: uses, dosage, side effects, interactions, safety, cost. Be detailed and helpful. Include a medical disclaimer.`;

export default function MedicineScanner() {
  const [mode, setMode] = useState<Mode>('image');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); setState('idle'); setResult(''); };
  const handleClear = () => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(null); setState('idle'); setResult(''); setError(''); };

  const reset = () => { handleClear(); setQuery(''); setState('idle'); setResult(''); setError(''); };

  const analyze = async () => {
    setState('loading');
    setError('');
    try {
      let text: string;
      if (mode === 'image' && file) {
        const { base64, mediaType } = await fileToBase64(file);
        text = await callClaude({
          system: IMAGE_SYSTEM,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: 'Identify and analyze this medicine. Provide complete information.' },
            ],
          }],
          maxTokens: 2500,
        });
      } else {
        if (!query.trim()) return;
        text = await callClaude({
          system: TEXT_SYSTEM,
          messages: [{ role: 'user', content: `Provide complete information about: ${query.trim()}` }],
          maxTokens: 2500,
        });
      }
      setResult(text);
      setState('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.');
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ScanLine size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Medicine Scanner</h1>
          </div>
          <p className="text-slate-400">Photograph a medicine or search by name for complete information.</p>
        </motion.div>

        {/* Mode tabs + Input */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card p-6 mb-6">
          <div className="flex gap-2 mb-5">
            {(['image', 'search'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); reset(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {m === 'image' ? <><ScanLine size={15} /> Scan Image</> : <><Search size={15} /> Search by Name</>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'image' ? (
              <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ImageUploader onFile={handleFile} preview={preview} onClear={handleClear} label="Drop medicine image here" />
                <button onClick={analyze} disabled={!file || state === 'loading'}
                  className="w-full mt-4 btn-primary flex items-center justify-center gap-2">
                  {state === 'loading' ? <><RefreshCw size={16} className="animate-spin" />Analyzing...</> : <><Sparkles size={16} />Identify Medicine</>}
                </button>
              </motion.div>
            ) : (
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex gap-2">
                  <input
                    className="input-field flex-1"
                    placeholder="Type medicine name (e.g. Paracetamol, Metformin...)"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && query.trim() && analyze()}
                  />
                  <button onClick={analyze} disabled={!query.trim() || state === 'loading'}
                    className="btn-primary flex items-center gap-2 shrink-0">
                    {state === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                    Search
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {QUICK_CHIPS.map(chip => (
                    <button key={chip} onClick={() => { setQuery(chip); setState('idle'); setResult(''); setError(''); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-blue-500/20 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 transition-all">
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {state === 'loading' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card p-12 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Analyzing with AI...</p>
                <p className="text-slate-500 text-sm mt-1">Fetching comprehensive medicine data</p>
              </div>
            </motion.div>
          )}

          {state === 'error' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card p-6 border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold mb-1">Analysis Failed</p>
                  <p className="text-red-300 text-sm">{error}</p>
                  <button onClick={reset} className="mt-3 text-sm text-slate-400 hover:text-white transition-colors">← Try again</button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'done' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Analysis Complete</span>
                </div>
                <button onClick={reset}
                  className="text-xs text-slate-500 hover:text-white transition-colors border border-white/10 px-3 py-1 rounded-lg flex items-center gap-1">
                  <X size={12} /> Clear
                </button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                <MarkdownRenderer content={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
