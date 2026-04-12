import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';

const CommandsPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  const basicCmds = [
    { cmd: 'claude', desc: t('hp_cmd_basic_1') },
    { cmd: 'claude --version', desc: t('hp_cmd_basic_2') },
    { cmd: 'claude --help', desc: t('hp_cmd_basic_3') },
    { cmd: 'claude -p "..."', desc: t('hp_cmd_basic_4') },
  ];

  const slashCmds = [
    { cmd: '/help', desc: t('hp_cmd_slash_1') },
    { cmd: '/clear', desc: t('hp_cmd_slash_2') },
    { cmd: '/compact', desc: t('hp_cmd_slash_3') },
    { cmd: '/config', desc: t('hp_cmd_slash_4') },
    { cmd: '/cost', desc: t('hp_cmd_slash_5') },
    { cmd: '/doctor', desc: t('hp_cmd_slash_6') },
    { cmd: '/init', desc: t('hp_cmd_slash_7') },
    { cmd: '/model', desc: t('hp_cmd_slash_8') },
    { cmd: '/status', desc: t('hp_cmd_slash_9') },
  ];

  const shortcuts = [
    { desc: t('hp_cmd_key_1'), keys: ['Ctrl', 'C'] },
    { desc: t('hp_cmd_key_2'), keys: ['Ctrl', 'D'] },
    { desc: t('hp_cmd_key_3'), keys: ['Shift', 'Enter'] },
    { desc: t('hp_cmd_key_4'), keys: ['Enter'] },
  ];

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_cmd_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_cmd_title')}</h1>
      <p className="hp-page-desc">{t('hp_cmd_desc')}</p>

      <ContentCard title={t('hp_cmd_basic_title')}>
        <div className="hp-command-list">
          {basicCmds.map((c) => (
            <div key={c.cmd} className="hp-command-item">
              <code>{c.cmd}</code>
              <span>{c.desc}</span>
            </div>
          ))}
        </div>
      </ContentCard>

      <ContentCard title={t('hp_cmd_slash_title')}>
        <div className="hp-command-list">
          {slashCmds.map((c) => (
            <div key={c.cmd} className="hp-command-item">
              <code>{c.cmd}</code>
              <span>{c.desc}</span>
            </div>
          ))}
        </div>
      </ContentCard>

      <ContentCard title={t('hp_cmd_shortcut_title')}>
        <div className="hp-shortcut-list">
          {shortcuts.map((s, i) => (
            <div key={i} className="hp-shortcut-item">
              <span className="hp-shortcut-desc">{s.desc}</span>
              <span>
                {s.keys.map((k, j) => (
                  <React.Fragment key={k}>
                    {j > 0 && ' + '}
                    <kbd>{k}</kbd>
                  </React.Fragment>
                ))}
              </span>
            </div>
          ))}
        </div>
      </ContentCard>

      <div className="hp-notice tip" dangerouslySetInnerHTML={{ __html: t('hp_cmd_notice') }} />
    </div>
  );
};

export default CommandsPage;
