import React from 'react';
import { Popover, Toast } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';

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

const copyToClipboard = (text, t) => {
  navigator.clipboard.writeText(text).then(() => {
    Toast.success(t('复制成功'));
  });
};

const GroupItem = ({ group, t }) => (
  <div className='flex flex-col items-center gap-2 py-3'>
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium text-semi-color-text-0'>
        {group.group_number}
      </span>
      <button
        onClick={() => copyToClipboard(group.group_number, t)}
        className='inline-flex items-center justify-center w-6 h-6 rounded cursor-pointer border-none bg-transparent text-semi-color-text-2 hover:text-semi-color-primary hover:bg-semi-color-fill-0 transition-colors'
        aria-label={t('复制群号')}
      >
        <IconCopy size='small' />
      </button>
    </div>
    {group.note && (
      <span className='text-xs text-semi-color-text-2'>{group.note}</span>
    )}
    {group.qrcode && (
      <img
        src={group.qrcode}
        alt={group.note || group.group_number}
        className='w-40 h-40 rounded-lg object-contain'
      />
    )}
  </div>
);

const ContactButton = ({ contactQRCode, contactLabel, contactGroups, t, isMobile }) => {
  const label = contactLabel || t('加入 QQ 群');
  const groups = Array.isArray(contactGroups) ? contactGroups : [];
  const hasGroups = groups.length > 0;

  let content;
  if (hasGroups) {
    content = (
      <div className='flex flex-col items-center p-2' style={{ maxHeight: 400, overflowY: 'auto' }}>
        <span className='text-sm font-medium text-semi-color-text-0 pb-2'>
          {label}
        </span>
        {groups.map((group, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <div className='w-full border-t border-semi-color-border my-1' />
            )}
            <GroupItem group={group} t={t} />
          </React.Fragment>
        ))}
      </div>
    );
  } else if (contactQRCode) {
    content = (
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
    );
  } else {
    content = (
      <div className='flex flex-col items-center gap-2 p-4'>
        <QQIcon size={32} />
        <span className='text-sm text-semi-color-text-2'>
          {t('暂未配置联系群')}
        </span>
      </div>
    );
  }

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
