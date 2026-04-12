import React from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { ArrowRight } from 'lucide-react';

const PricingSection = () => {
  const [ref, isInView] = useInView();
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className={clsx('ld-fade py-24 px-6', isInView && 'ld-visible')}
    >
      <div
        className='mx-auto text-center'
        style={{ maxWidth: '600px' }}
      >
        <p
          className='text-xs tracking-widest uppercase mb-3'
          style={{ color: 'var(--ld-text-muted)' }}
        >
          Pricing
        </p>
        <h2
          className='text-2xl sm:text-3xl font-semibold mb-6'
          style={{ color: 'var(--ld-text-strong)' }}
        >
          极致性价比
        </h2>

        <div
          className='rounded-xl p-8 sm:p-12 mb-8'
          style={{
            background: 'var(--ld-bg-card)',
            border: '1px solid var(--ld-border)',
          }}
        >
          <div className='mb-4'>
            <span
              className='text-5xl sm:text-6xl font-bold'
              style={{ color: 'var(--ld-text-strong)', letterSpacing: '-0.03em' }}
            >
              ¥0.3
            </span>
            <span
              className='text-lg ml-2'
              style={{ color: 'var(--ld-text-muted)' }}
            >
              / 刀
            </span>
          </div>
          <p className='text-sm mb-6' style={{ color: 'var(--ld-text-muted)' }}>
            按量付费 · 用多少付多少 · 余额永不过期
          </p>
          <div
            className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs mb-8'
            style={{ color: 'var(--ld-text-muted)' }}
          >
            <span>全部模型可用</span>
            <span>·</span>
            <span>支持支付宝 / 微信</span>
            <span>·</span>
            <span>无月费绑定</span>
          </div>
          <button
            className='ld-btn ld-btn--primary'
            onClick={() => navigate('/console')}
          >
            立即充值 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
