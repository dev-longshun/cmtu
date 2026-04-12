import React, { useState } from 'react';
import clsx from 'clsx';
import { useInView } from '../hooks/useInView';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'RabbitCode 是什么？',
    a: 'RabbitCode 是企业级 AI API 中转站，基于开源 New API 二次开发，聚合 40+ 上游供应商，提供统一 API 和全球加速。',
  },
  {
    q: '支持哪些模型？',
    a: '支持 GPT-4o、o3、Claude 4、Gemini 2.5、DeepSeek V3、Qwen 3、Mistral 等 200+ 模型。',
  },
  {
    q: '如何配置 Claude Code / Cursor？',
    a: '设置 BASE_URL 和 API_KEY 两个环境变量即可，一行命令完成。支持 OpenAI 和 Anthropic 两种协议。',
  },
  {
    q: '数据安全如何保障？',
    a: 'TLS 1.3 加密传输，密钥加密存储，请求数据不落盘不留存，不记录对话内容。',
  },
  {
    q: '如何付费？',
    a: '支持支付宝、微信支付，按量计费，余额永不过期。',
  },
];

const FAQSection = () => {
  const [ref, isInView] = useInView();
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      ref={ref}
      className={clsx('ld-fade py-24 px-6', isInView && 'ld-visible')}
    >
      <div className='mx-auto' style={{ maxWidth: '680px' }}>
        <p
          className='text-xs tracking-widest uppercase text-center mb-3'
          style={{ color: 'var(--ld-text-muted)' }}
        >
          FAQ
        </p>
        <h2
          className='text-2xl sm:text-3xl font-semibold text-center mb-12'
          style={{ color: 'var(--ld-text-strong)' }}
        >
          常见问题
        </h2>
        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className='ld-faq-item'>
              <button
                className='ld-faq-trigger'
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <ChevronDown size={16} />
              </button>
              <div
                className={clsx(
                  'ld-faq-body',
                  openIndex === i && 'ld-faq-body--open',
                )}
              >
                <div className='ld-faq-content'>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
