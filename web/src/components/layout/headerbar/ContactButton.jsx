import React from 'react';
import { Popover } from '@douyinfe/semi-ui';

const QQIcon = ({ size = 18 }) => (
  <svg
    viewBox='0 0 1024 1024'
    width={size}
    height={size}
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z' />
  </svg>
);

const ContactButton = ({ contactQRCode, contactLabel, t, isMobile }) => {
  const label = contactLabel || t('加入 QQ 群');

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
      <QQIcon size={32} />
      <span className='text-sm text-semi-color-text-2'>
        {t('暂未配置 QQ 群二维码')}
      </span>
    </div>
  );

  return (
    <Popover content={content} trigger='click' position='bottomRight'>
      <button
        aria-label={label}
        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium cursor-pointer border-none transition-opacity hover:opacity-85'
        style={{ backgroundColor: '#12B7F5' }}
      >
        <QQIcon size={16} />
        {!isMobile && <span>{label}</span>}
      </button>
    </Popover>
  );
};

export default ContactButton;
