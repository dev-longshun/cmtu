import React from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { ArrowRight } from 'lucide-react';

const TrustSignals = () => {
  const [ref, isInView] = useInView();
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className={clsx('ld-fade py-24 px-6', isInView && 'ld-visible')}
    >
      <div className='mx-auto text-center' style={{ maxWidth: 'var(--ld-max-w)' }}>
        <h2
          className='text-2xl sm:text-3xl font-semibold mb-3'
          style={{ color: 'var(--ld-text-strong)' }}
        >
          准备好了吗？
        </h2>
        <p
          className='text-sm mb-8'
          style={{ color: 'var(--ld-text-muted)' }}
        >
          3 分钟接入全球主流 AI 模型，开始高效编程
        </p>
        <button
          className='ld-btn ld-btn--primary'
          onClick={() => navigate('/console')}
        >
          免费开始 <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};

export default TrustSignals;
