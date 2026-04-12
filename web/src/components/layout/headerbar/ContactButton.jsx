import React from 'react';
import { Popover } from '@douyinfe/semi-ui';

const WeChatIcon = ({ size = 18 }) => (
  <svg
    viewBox='0 0 1024 1024'
    width={size}
    height={size}
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M690.1 377.4c5.9 0 11.8.2 17.6.5-24.4-128.7-158.3-227.1-313.4-227.1C209 150.8 57.7 284.2 57.7 446.5c0 93.3 49.7 170.7 136 228.7L154.8 757l100.2-53.4c43.1 10.2 80.4 21.6 124.3 21.6 5.6 0 11.2-.2 16.7-.5-3.5-12.2-5.5-24.9-5.5-38 0-165.2 143.2-309.3 299.6-309.3zM487.7 319.2c16.3 0 29.5 13.2 29.5 29.5s-13.2 29.5-29.5 29.5-29.5-13.2-29.5-29.5 13.2-29.5 29.5-29.5zm-196.8 59c-16.3 0-29.5-13.2-29.5-29.5s13.2-29.5 29.5-29.5 29.5 13.2 29.5 29.5-13.2 29.5-29.5 29.5z' />
    <path d='M944.5 609.2c0-134.7-131.1-244.1-277.9-244.1-154.8 0-278.1 109.4-278.1 244.1S511.8 853.4 666.6 853.4c38.5 0 77.1-10.2 115.6-20.5l85.4 49.5-24.4-77.1c74.1-49.4 101.3-109.4 101.3-196.1zM588.2 567.6c-13.2 0-24.4-11.2-24.4-24.4s11.2-24.4 24.4-24.4 24.4 11.2 24.4 24.4-11.2 24.4-24.4 24.4zm157.2 0c-13.2 0-24.4-11.2-24.4-24.4s11.2-24.4 24.4-24.4 24.4 11.2 24.4 24.4-11.2 24.4-24.4 24.4z' />
  </svg>
);

const ContactButton = ({ contactQRCode, contactLabel, t, isMobile }) => {
  const label = contactLabel || t('添加企微客服');

  const content = contactQRCode ? (
    <div className='flex flex-col items-center gap-3 p-3'>
      <span className='text-sm font-medium text-semi-color-text-0'>
        {label}
      </span>
      <img
        src={contactQRCode}
        alt={label}
        className='w-48 h-48 rounded-lg object-contain'
      />
    </div>
  ) : (
    <div className='flex flex-col items-center gap-2 p-4'>
      <WeChatIcon size={32} />
      <span className='text-sm text-semi-color-text-2'>
        {t('暂未配置企微客服二维码')}
      </span>
    </div>
  );

  return (
    <Popover content={content} trigger='click' position='bottomRight'>
      <button
        aria-label={label}
        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium cursor-pointer border-none transition-opacity hover:opacity-85'
        style={{ backgroundColor: '#07C160' }}
      >
        <WeChatIcon size={16} />
        {!isMobile && <span>{label}</span>}
      </button>
    </Popover>
  );
};

export default ContactButton;
