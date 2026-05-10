import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onFile: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
  label?: string;
  sublabel?: string;
  accept?: string;
}

export default function ImageUploader({
  onFile,
  preview,
  onClear,
  label = 'Drop your image here',
  sublabel = 'or click to browse',
  accept = 'image/*',
}: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) onFile(file);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-800/50"
          >
            <img src={preview} alt="Preview" className="w-full max-h-72 object-contain" />
            {onClear && (
              <button
                onClick={onClear}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col items-center justify-center gap-3 w-full py-12 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              dragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/10 hover:border-white/25 bg-slate-800/30 hover:bg-slate-800/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className={`p-4 rounded-full transition-colors ${dragging ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
              {dragging ? (
                <ImageIcon size={28} className="text-cyan-400" />
              ) : (
                <Upload size={28} className="text-slate-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-medium">{label}</p>
              <p className="text-slate-500 text-sm mt-1">{sublabel}</p>
              <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
            <input type="file" accept={accept} className="hidden" onChange={handleChange} />
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
}
