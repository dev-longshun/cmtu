import React from 'react';
import clsx from 'clsx';
import { useInView } from '../hooks/useInView';
import { Claude, Cursor, Cline, Copilot, OpenAI, Gemini } from '@lobehub/icons';
import { Terminal, Code2, Braces, Laptop } from 'lucide-react';

const TOOLS = [
  { name: 'Claude Code', Icon: Claude },
  { name: 'Cursor', Icon: Cursor },
  { name: 'Cline', Icon: Cline },
  { name: 'GitHub Copilot', Icon: Copilot },
  { name: 'Codex CLI', Icon: OpenAI },
  { name: 'Gemini CLI', Icon: Gemini },
  { name: 'OpenCode', Icon: Terminal },
  { name: 'OpenClaw', Icon: Code2 },
  { name: 'Windsurf', Icon: Braces },
  { name: 'VS Code', Icon: Laptop },
];

const ToolsCarousel = () => {
  const [ref, isInView] = useInView();
  const items = [...TOOLS, ...TOOLS];

  return (
    <section
      ref={ref}
      className={clsx('ld-section py-20 px-6', isInView && 'ld-visible')}
    >
      <h2 className='ld-section-title'>适配 20+ 编程工具</h2>
      <p className='ld-section-subtitle'>
        Claude Code、Cursor、Cline、Copilot 等主流 AI 编程工具开箱即用
      </p>
      <div className='ld-carousel'>
        <div
          className='ld-carousel-track ld-carousel-track--reverse'
          style={{ '--ld-carousel-speed': '28s' }}
        >
          {items.map((t, i) => (
            <div key={i} className='ld-carousel-item'>
              <t.Icon size={24} />
              <span style={{ color: 'var(--ld-text-strong)', fontWeight: 500 }}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsCarousel;
