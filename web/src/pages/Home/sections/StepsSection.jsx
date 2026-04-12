import React from 'react';
import clsx from 'clsx';
import { useInView } from '../hooks/useInView';

const STEPS = [
  { num: '01', title: '注册账号', desc: '30 秒完成注册，获取 API 密钥' },
  { num: '02', title: '安装工具', desc: '安装 Claude Code、Cursor 或其他 AI 编程工具' },
  { num: '03', title: '配置接入', desc: '设置 Base URL 和 API Key，一行命令搞定' },
  { num: '04', title: '开始编码', desc: '享受全球加速的 AI 辅助编程体验' },
];

const StepsSection = () => {
  const [ref, isInView] = useInView();

  return (
    <section
      ref={ref}
      className={clsx('ld-fade py-24 px-6', isInView && 'ld-visible')}
    >
      <div className='mx-auto' style={{ maxWidth: 'var(--ld-max-w)' }}>
        <p
          className='text-xs tracking-widest uppercase text-center mb-3'
          style={{ color: 'var(--ld-text-muted)' }}
        >
          Quick Start
        </p>
        <h2
          className='text-2xl sm:text-3xl font-semibold text-center mb-4'
          style={{ color: 'var(--ld-text-strong)' }}
        >
          4 步开始 AI 编程
        </h2>
        <p
          className='text-sm text-center mb-14'
          style={{ color: 'var(--ld-text-muted)' }}
        >
          从注册到编码，最快 3 分钟完成全部配置
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {STEPS.map((s) => (
            <div key={s.num} className='ld-card flex flex-col gap-3'>
              <span className='ld-step-num'>{s.num}</span>
              <h3
                className='text-base font-medium'
                style={{ color: 'var(--ld-text-strong)' }}
              >
                {s.title}
              </h3>
              <p className='text-sm leading-relaxed' style={{ color: 'var(--ld-text-muted)' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
