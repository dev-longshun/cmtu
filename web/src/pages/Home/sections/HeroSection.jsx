import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TERMINAL_LINES = [
  { type: 'dim', text: '# Configure your AI coding tool' },
  { type: 'cmd', text: '$ export BASE_URL=https://rabbitcodecc.com/v1' },
  { type: 'cmd', text: '$ export API_KEY="sk-****************"' },
  { type: 'empty' },
  { type: 'dim', text: '# Start coding' },
  { type: 'cmd', text: '$ claude' },
  { type: 'ok', text: '✓ Connected to RabbitCode API' },
];

const MODELS = [
  'GPT-4o', 'Claude 4', 'Gemini 2.5', 'DeepSeek V3',
  'Qwen 3', 'o3', 'Grok', 'Mistral', 'GLM-4', 'Llama 4',
];

const TOOLS = [
  'Claude Code', 'Codex', 'Gemini CLI', 'Cursor',
  'Cline', 'Aider', 'Copilot', 'OpenCode', 'Windsurf',
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className='relative pt-16 overflow-hidden'>
      <div
        className='relative z-10 mx-auto flex flex-col lg:flex-row items-start gap-16 px-6 py-20 lg:py-28'
        style={{ maxWidth: 'var(--ld-max-w)' }}
      >
        {/* Left column */}
        <div className='flex-1 flex flex-col'>
          <p
            className='text-xs tracking-widest uppercase mb-6'
            style={{ color: 'var(--ld-text-muted)', letterSpacing: '0.2em' }}
          >
            Enterprise AI Gateway
          </p>

          <h1
            className='text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-4'
            style={{ color: 'var(--ld-text-strong)', letterSpacing: '-0.02em' }}
          >
            RabbitCode
          </h1>
          <h2
            className='text-xl sm:text-2xl font-light mb-6'
            style={{ color: 'var(--ld-text-muted)' }}
          >
            企业级 AI 中转站
          </h2>
          <p
            className='text-base leading-relaxed mb-8 max-w-md'
            style={{ color: 'var(--ld-text)' }}
          >
            一站式接入全球主流 AI 模型，丝滑适配 20+ 编程工具。
            全球网络加速，开箱即用。
          </p>

          <div className='flex flex-wrap gap-3 mb-12'>
            <button
              className='ld-btn ld-btn--primary'
              onClick={() => navigate('/console')}
            >
              快速接入 <ArrowRight size={14} />
            </button>
            <button
              className='ld-btn ld-btn--ghost'
              onClick={() => navigate('/pricing')}
            >
              查看方案
            </button>
          </div>

          {/* Inline model badges — auto scroll */}
          <div className='mb-4'>
            <p
              className='text-xs uppercase tracking-wider mb-2'
              style={{ color: 'var(--ld-text-muted)' }}
            >
              支持全球主流模型
            </p>
            <div className='ld-badge-scroll'>
              <div className='ld-badge-track' style={{ '--ld-badge-speed': '25s' }}>
                {[...MODELS, ...MODELS].map((m, i) => (
                  <span key={i} className='ld-badge'>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Inline tool badges — auto scroll reverse */}
          <div>
            <p
              className='text-xs uppercase tracking-wider mb-2'
              style={{ color: 'var(--ld-text-muted)' }}
            >
              丝滑接入 20+ 编程工具
            </p>
            <div className='ld-badge-scroll'>
              <div className='ld-badge-track ld-badge-track--reverse' style={{ '--ld-badge-speed': '22s' }}>
                {[...TOOLS, ...TOOLS].map((t, i) => (
                  <span key={i} className='ld-badge'>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Terminal */}
        <div className='flex-1 w-full max-w-xl lg:mt-8'>
          <TerminalTyping />
        </div>
      </div>
    </section>
  );
};

const TerminalTyping = () => {
  const [displayed, setDisplayed] = useState([]);
  const [charIndex, setCharIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (done) return;
    if (lineIndex >= TERMINAL_LINES.length) {
      setDone(true);
      return;
    }

    const line = TERMINAL_LINES[lineIndex];

    if (line.type === 'empty') {
      setDisplayed((prev) => [...prev, { type: 'empty', text: '' }]);
      setLineIndex((l) => l + 1);
      setCharIndex(0);
      return;
    }

    if (charIndex === 0) {
      setDisplayed((prev) => [...prev, { type: line.type, text: '' }]);
    }

    if (charIndex < line.text.length) {
      const speed = line.type === 'dim' ? 15 : 25;
      const timer = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            type: line.type,
            text: line.text.slice(0, charIndex + 1),
          };
          return next;
        });
        setCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const pause = line.type === 'ok' ? 0 : 300;
      const timer = setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, pause);
      return () => clearTimeout(timer);
    }
  }, [lineIndex, charIndex, done]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayed]);

  return (
    <div className='ld-terminal'>
      <div className='ld-terminal-bar'>
        <div className='ld-terminal-dot' style={{ background: '#ff5f57' }} />
        <div className='ld-terminal-dot' style={{ background: '#febc2e' }} />
        <div className='ld-terminal-dot' style={{ background: '#28c840' }} />
        <span
          style={{ marginLeft: 8, fontSize: 11, color: '#444', letterSpacing: '0.1em' }}
        >
          RABBITCODE.SH
        </span>
      </div>
      <div className='ld-terminal-body' ref={bodyRef}>
        <pre style={{ margin: 0 }}>
          {displayed.map((line, i) => {
            if (line.type === 'empty') return <br key={i} />;
            const cls =
              line.type === 'dim' ? 'ld-dim' :
              line.type === 'ok' ? 'ld-ok' : 'ld-val';
            return (
              <div key={i}>
                <span className={cls}>{line.text}</span>
              </div>
            );
          })}
          {!done && <span className='ld-cursor' />}
        </pre>
      </div>
    </div>
  );
};

export default HeroSection;
