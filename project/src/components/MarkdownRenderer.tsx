interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-white mt-4 mb-1.5">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-5 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-cyan-500 pl-3 text-slate-400 italic my-2">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 items-start"><span class="text-cyan-400 mt-1 shrink-0">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex gap-2 items-start"><span class="text-cyan-400 font-mono text-sm mt-0.5 shrink-0">$1.</span><span>$2</span></li>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-700 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/(<li[\s\S]*?<\/li>)/g, (match) => {
      if (match.includes('<li')) {
        return `<ul class="space-y-1.5 my-2">${match}</ul>`;
      }
      return match;
    })
    .replace(/\n\n/g, '</p><p class="text-slate-300 leading-relaxed my-2">')
    .replace(/\n/g, '<br/>');

  return (
    <div
      className={`prose-custom text-slate-300 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: `<p class="text-slate-300 leading-relaxed">${html}</p>` }}
    />
  );
}
