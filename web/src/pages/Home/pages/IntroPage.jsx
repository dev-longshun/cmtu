import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';

const IntroPage = ({ serverAddress }) => {
  const { t } = useTranslation();
  const groups = [
    { name: t('hp_intro_g1_name'), rate: t('hp_intro_g1_rate'), rateColor: 'purple', desc: t('hp_intro_g1_desc') },
  ];

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_intro_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_intro_title')}</h1>
      <p className="hp-page-desc">{t('hp_intro_desc')}</p>

      <ContentCard title={t('hp_intro_card_title')} tag={t('hp_intro_card_tag')} tagColor="purple">
        <div className="hp-group-list">
          {groups.map((g, i) => (
            <div key={i} className={`hp-group-item${g.featured ? ' featured' : ''}`}>
              <div className="hp-group-header">
                <span className="hp-group-name">
                  {g.name}
                  {g.badge && <span className={`hp-recommend-badge ${g.badgeColor}`}>{g.badge}</span>}
                </span>
                <span className={`hp-group-rate ${g.rateColor}`}>{g.rate}</span>
              </div>
              <div className="hp-group-desc">{g.desc}</div>
            </div>
          ))}
        </div>
      </ContentCard>
    </div>
  );
};

export default IntroPage;
