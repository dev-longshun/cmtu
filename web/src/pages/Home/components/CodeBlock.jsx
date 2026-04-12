import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const CodeBlock = ({ children, copyData }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = typeof copyData === 'function' ? copyData() : (copyData || children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [copyData, children]);

  return (
    <div className="hp-code-block">
      <button className="hp-copy-btn" onClick={handleCopy}>
        {copied ? t('hp_copy_success') : t('hp_copy')}
      </button>
      <pre>{children}</pre>
    </div>
  );
};

export default CodeBlock;
