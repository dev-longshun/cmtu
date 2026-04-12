import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';

const StartPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_start_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_start_title')}</h1>
      <p className="hp-page-desc">{t('hp_start_desc')}</p>

      <ContentCard step={1} title={t('hp_start_step1_title')}>
        <p>
          {t('hp_start_step1_text1')}
          <a href={`${serverAddress}/register`} target="_blank" rel="noopener noreferrer">
            {serverAddress}/register
          </a>
          {t('hp_start_step1_text2')}
        </p>
      </ContentCard>

      <ContentCard step={2} title={t('hp_start_step2_title')}>
        <p>{t('hp_start_step2_text')}</p>
      </ContentCard>

      <ContentCard step={3} title={t('hp_start_step3_title')}>
        <p>{t('hp_start_step3_text')}</p>
      </ContentCard>
    </div>
  );
};

export default StartPage;
