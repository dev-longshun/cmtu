import React from 'react';
import clsx from 'clsx';
import { useInView } from '../hooks/useInView';
import {
  OpenAI,
  Claude,
  Gemini,
  DeepSeek,
  Qwen,
  Mistral,
  Moonshot,
  Zhipu,
  Cohere,
  XAI,
  Yi,
  Doubao,
  Perplexity,
} from '@lobehub/icons';

const MODELS = [
  { name: 'GPT-4o', Icon: OpenAI },
  { name: 'Claude 4', Icon: Claude },
  { name: 'Gemini 2.5', Icon: Gemini },
  { name: 'DeepSeek V3', Icon: DeepSeek },
  { name: 'Qwen 3', Icon: Qwen },
  { name: 'Mistral Large', Icon: Mistral },
  { name: 'Moonshot', Icon: Moonshot },
  { name: 'GLM-4', Icon: Zhipu },
  { name: 'Command R+', Icon: Cohere },
  { name: 'Grok', Icon: XAI },
  { name: 'Yi-Large', Icon: Yi },
  { name: 'Doubao', Icon: Doubao },
  { name: 'Perplexity', Icon: Perplexity },
];

const ModelCarousel = () => {
  const [ref, isInView] = useInView();
  const items = [...MODELS, ...MODELS];

  return (
    <section
      ref={ref}
      className={clsx('ld-section py-20 px-6', isInView && 'ld-visible')}
    >
      <h2 className='ld-section-title'>支持全球主流 AI 模型</h2>
      <p className='ld-section-subtitle'>
        一站式接入 OpenAI、Anthropic、Google、DeepSeek 等 40+ 供应商
      </p>
      <div className='ld-carousel'>
        <div className='ld-carousel-track' style={{ '--ld-carousel-speed': '35s' }}>
          {items.map((m, i) => (
            <div key={i} className='ld-carousel-item'>
              <m.Icon size={24} />
              <span style={{ color: 'var(--ld-text-strong)', fontWeight: 500 }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelCarousel;
