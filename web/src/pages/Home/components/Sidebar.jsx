import React from 'react';
import { useTranslation } from 'react-i18next';

const NAV_GROUPS = [
  {
    labelKey: 'hp_nav_required',
    items: [
      { id: 'intro', labelKey: 'hp_nav_intro' },
    ],
  },
  {
    labelKey: 'hp_nav_tutorial',
    items: [
      { id: 'start', labelKey: 'hp_nav_start' },
      { id: 'config', labelKey: 'hp_nav_config' },
      { id: 'downgrade', labelKey: 'hp_nav_downgrade' },
      { id: 'vscode', labelKey: 'hp_nav_vscode' },
      { id: 'errors', labelKey: 'hp_nav_errors' },
    ],
  },
  {
    labelKey: 'hp_nav_apiRef',
    items: [{ id: 'api', labelKey: 'hp_nav_api' }],
  },
  {
    labelKey: 'hp_nav_faqSection',
    items: [
      { id: 'faq', labelKey: 'hp_nav_faq' },
      { id: 'commands', labelKey: 'hp_nav_commands' },
    ],
  },
];

const Sidebar = ({ activePage, onNavigate, open, onClose }) => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'zh-CN' ? 'en' : 'zh-CN';
    i18n.changeLanguage(next);
  };

  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <aside className={`hp-sidebar${open ? ' open' : ''}`}>
      <div className="hp-logo">
        <img className="hp-logo-icon" src="/hp-logo.jpg" alt="Logo" />
        <div className="hp-logo-text">
          <strong>{t('hp_logo_title')}</strong>
          <small>{t('hp_logo_subtitle')}</small>
        </div>
      </div>

      <nav className="hp-nav">
        {NAV_GROUPS.map((group) => (
          <div className="hp-nav-group" key={group.labelKey}>
            <div className="hp-nav-label">{t(group.labelKey)}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`hp-nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                {t(item.labelKey)}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="hp-sidebar-footer">
        <button className="hp-lang-switch sidebar-lang" onClick={toggleLang} type="button">
          {i18n.language === 'zh-CN' ? '中文' : 'EN'}
        </button>
        <div className="hp-copyright">{t('hp_copyright')}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
