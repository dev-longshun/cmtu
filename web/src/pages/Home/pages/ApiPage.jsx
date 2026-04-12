import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';

const ApiPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_api_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_api_title')}</h1>
      <p className="hp-page-desc">{t('hp_api_desc')}</p>

      <ContentCard title={t('hp_api_card_title')}>
        <div className="hp-url-options">
          <div className="hp-url-item">
            <div className="hp-url-label">{t('hp_api_main_line')}</div>
            <div className="hp-url-value">{serverAddress}/</div>
          </div>
        </div>
      </ContentCard>
    </div>
  );
};

export default ApiPage;
