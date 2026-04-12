import React from 'react';
import './landing.css';

const DefaultHome = () => {
  return (
    <div className='ld-root'>
      <div className='ld-hero'>
        <img src='/logo.png' alt='草莓兔' className='ld-hero-logo' />
        <h1 className='ld-hero-title'>草莓兔</h1>
        <p className='ld-hero-tagline'>你的 AI 大模型聚合站</p>
      </div>
    </div>
  );
};

export default DefaultHome;
