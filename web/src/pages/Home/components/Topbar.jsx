import React from 'react';
import { useTranslation } from 'react-i18next';

const PAGE_TITLES = {
  intro: 'hp_nav_intro',
  advantage: 'hp_nav_advantage',
  start: 'hp_nav_start',
  config: 'hp_nav_config',
  downgrade: 'hp_nav_downgrade',
  vscode: 'hp_nav_vscode',
  errors: 'hp_nav_errors',
  api: 'hp_nav_api',
  faq: 'hp_nav_faq',
  commands: 'hp_nav_commands',
};

const Topbar = ({ activePage, sidebarOpen, onToggleSidebar, serverAddress }) => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'zh-CN' ? 'en' : 'zh-CN';
    i18n.changeLanguage(next);
  };

  return (
    <header className="hp-topbar">
      <button
        className={`hp-menu-toggle${sidebarOpen ? ' open' : ''}`}
        onClick={onToggleSidebar}
        type="button"
        aria-label="Menu"
      >
        <span className="hp-menu-toggle-icon" aria-hidden="true" />
      </button>
      <div className="hp-topbar-title">
        {t(PAGE_TITLES[activePage] || 'hp_logo_title')}
      </div>
      <a
        className="hp-topbar-link"
        href={serverAddress || '/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('hp_nav_home')}
      </a>
      <button className="hp-lang-switch" onClick={toggleLang} type="button">
        {i18n.language === 'zh-CN' ? '中文' : 'EN'}
      </button>
    </header>
  );
};

export default Topbar;
