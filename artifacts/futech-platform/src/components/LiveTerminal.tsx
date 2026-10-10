import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Check, Play, RefreshCw, ShieldCheck, GitBranch, Sparkles } from 'lucide-react';

interface LiveTerminalProps {
  compact?: boolean;
}

type CommandKey = 'init' | 'fqs' | 'audit' | 'handover';

export function LiveTerminal({ compact = false }: LiveTerminalProps) {
  const [activeCommand, setActiveCommand] = useState<CommandKey>('init');

  const commandOutputs: Record<CommandKey, {
    cmd: string;
    lines: { text: string; color: string; prefix?: string }[];
  }> = {
    init: {
      cmd: 'futech init --project=aurora',
      lines: [
        { text: 'deps resolved in 1.2s', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'verified devs: 140+ (Arab engineers)', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'match: عمر المطيري – FQS: 92/100', color: 'text-[#c084fc]', prefix: '→' },
        { text: 'futech git.handover --audit=owasp', color: 'text-[#38bdf8]', prefix: '$' },
        { text: '100% clean code & repo released in 0.3s', color: 'text-[#34d399]', prefix: '✓' },
      ],
    },
    fqs: {
      cmd: 'futech fqs.inspect --dev="Omar Al-Mutairi"',
      lines: [
        { text: 'calculating FQS score metrics...', color: 'text-slate-400', prefix: '⚡' },
        { text: 'job completion rate: 99% (تسليم كامل)', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'on time & budget: 98% (التزام بالوقت)', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'average star rating: 4.9/5.0 (رضا العملاء)', color: 'text-[#34d399]', prefix: '★' },
        { text: 'repeat hire rate: 92% (توظيف متكرر)', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'final FQS index: 92/100 (خبير معتمد)', color: 'text-[#c084fc]', prefix: '→' },
      ],
    },
    audit: {
      cmd: 'futech sec.audit --rules=owasp-top-10',
      lines: [
        { text: 'scanning codebase for vulnerabilities...', color: 'text-slate-400', prefix: '🛡️' },
        { text: 'zero backdoors or hidden contracts found', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'environment variables sanitized (.env.example)', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'license & copyright verified for client org', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'security status: PASSED (آمن تماماً)', color: 'text-[#34d399]', prefix: '✓' },
      ],
    },
    handover: {
      cmd: 'futech git.handover --target=client-org/repo',
      lines: [
        { text: 'initiating transfer ownership protocol...', color: 'text-slate-400', prefix: '📦' },
        { text: 'repository: client-org/futech-aurora-v2', color: 'text-[#38bdf8]', prefix: '→' },
        { text: 'admin permissions granted to project owner', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'README.md & Docker container verified', color: 'text-[#34d399]', prefix: '✓' },
        { text: 'SLA support timer started: 30 days active', color: 'text-[#c084fc]', prefix: '🕒' },
      ],
    },
  };

  const current = commandOutputs[activeCommand];

  return (
    <div
      dir="ltr"
      className={`rounded-3xl border border-[#1b3d60] bg-[#07131f]/95 font-mono text-[11px] shadow-2xl shadow-black/70 backdrop-blur-md overflow-hidden ${
        compact ? 'w-[320px] p-4' : 'w-full max-w-2xl p-5 sm:p-6'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        {/* macOS Traffic Dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
          <span className="h-3 w-3 rounded-full bg-[#eab308]" />
          <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
        </div>

        {/* Window Title */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
          <Terminal size={13} className="text-[#38bdf8]" />
          <span>futech — live engine</span>
        </div>

        {/* Live Pulsing Dot */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>live</span>
        </div>
      </div>

      {/* Interactive Command Tabs (Allows user to click and see real FuTech workflows) */}
      {!compact && (
        <div className="mb-4 flex flex-wrap gap-1.5 border-b border-white/5 pb-3" dir="rtl">
          <button
            onClick={() => setActiveCommand('init')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black transition ${
              activeCommand === 'init'
                ? 'bg-[#20878e] text-white shadow-md shadow-[#20878e]/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles size={11} />
            <span>تهيئة المشروع (init)</span>
          </button>

          <button
            onClick={() => setActiveCommand('fqs')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black transition ${
              activeCommand === 'fqs'
                ? 'bg-[#20878e] text-white shadow-md shadow-[#20878e]/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Terminal size={11} />
            <span>فحص مؤشر FQS</span>
          </button>

          <button
            onClick={() => setActiveCommand('audit')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black transition ${
              activeCommand === 'audit'
                ? 'bg-[#20878e] text-white shadow-md shadow-[#20878e]/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck size={11} />
            <span>فحص أمان OWASP</span>
          </button>

          <button
            onClick={() => setActiveCommand('handover')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black transition ${
              activeCommand === 'handover'
                ? 'bg-[#20878e] text-white shadow-md shadow-[#20878e]/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GitBranch size={11} />
            <span>تسليم مستودع GitHub</span>
          </button>
        </div>
      )}

      {/* Terminal Output Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCommand}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-1.5 text-left leading-relaxed"
        >
          {/* Active Command Prompt */}
          <div className="text-[#38bdf8] font-bold">
            <span className="text-[#00e5ff]">$ </span>
            <span>{current.cmd}</span>
          </div>

          {/* Render lines */}
          {current.lines.map((line, idx) => (
            <div key={idx} className={`flex items-center gap-1.5 ${line.color}`}>
              {line.prefix && <span className="font-bold">{line.prefix}</span>}
              <span>{line.text}</span>
            </div>
          ))}

          {/* Prompt with blinking block cursor */}
          <div className="flex items-center gap-1 pt-1 text-[#38bdf8]">
            <span>$</span>
            <span className="inline-block h-3.5 w-2 bg-[#00e5ff] animate-pulse" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
