import React from 'react';
import clsx from 'clsx';
import { useInView } from '../hooks/useInView';

const METRICS = [
  { value: '< 200ms', label: '平均延迟', desc: '全球多节点智能路由' },
  { value: '99.9%', label: '可用性 SLA', desc: '多线路冗余保障' },
  { value: 'TLS 1.3', label: '端到端加密', desc: '数据不落盘不留存' },
  { value: '24/7', label: '全天候监控', desc: '自动故障切换' },
];

const PerformanceSection = () => {
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
          Infrastructure
        </p>
        <h2
          className='text-2xl sm:text-3xl font-semibold text-center mb-14'
          style={{ color: 'var(--ld-text-strong)' }}
        >
          企业级基础设施
        </h2>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
          {METRICS.map((m, i) => (
            <div key={i} className='text-center'>
              <div
                className='text-3xl sm:text-4xl font-bold mb-2'
                style={{
                  color: 'var(--ld-text-strong)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {m.value}
              </div>
              <div
                className='text-sm font-medium mb-1'
                style={{ color: 'var(--ld-text)' }}
              >
                {m.label}
              </div>
              <div className='text-xs' style={{ color: 'var(--ld-text-muted)' }}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
