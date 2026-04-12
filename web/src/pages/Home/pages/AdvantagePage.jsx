import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';

const AdvantagePage = ({ serverAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_adv_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_adv_title')}</h1>
      <p className="hp-page-desc">{t('hp_adv_desc')}</p>

      <div className="hp-stats-row">
        <div className="hp-stat-card">
          <div className="hp-stat-value purple">{t('hp_adv_stat1_value')}</div>
          <div className="hp-stat-label">{t('hp_adv_stat1_label')}</div>
        </div>
        <div className="hp-stat-card">
          <div className="hp-stat-value blue">{t('hp_adv_stat2_value')}</div>
          <div className="hp-stat-label">{t('hp_adv_stat2_label')}</div>
        </div>
        <div className="hp-stat-card">
          <div className="hp-stat-value orange">{t('hp_adv_stat3_value')}</div>
          <div className="hp-stat-label">{t('hp_adv_stat3_label')}</div>
        </div>
      </div>

      <ContentCard title={t('hp_adv_card1_title')} tag={t('hp_adv_card1_tag')} tagColor="purple">
        <div className="hp-info-row">
          <div className="hp-info-item">
            <div className="hp-info-label">{t('hp_adv_card1_label1')}</div>
            <div className="hp-info-value purple">{t('hp_adv_card1_value1')}</div>
          </div>
          <div className="hp-info-item">
            <div className="hp-info-label">{t('hp_adv_card1_label2')}</div>
            <div className="hp-info-value green">{t('hp_adv_card1_value2')}</div>
          </div>
        </div>
        <div className="hp-warning-box">
          <div className="hp-warning-title">{t('hp_adv_warning_title')}</div>
          <ul className="hp-list-cross">
            <li>{t('hp_adv_warning_1')}</li>
            <li>{t('hp_adv_warning_2')}</li>
            <li>{t('hp_adv_warning_3')}</li>
          </ul>
        </div>
        <div className="hp-success-box">
          <div className="hp-success-title">{t('hp_adv_success_title')}</div>
          <ul className="hp-list-check">
            <li>{t('hp_adv_success_1')}</li>
            <li>{t('hp_adv_success_2')}</li>
            <li>{t('hp_adv_success_3')}</li>
            <li>{t('hp_adv_success_4')}</li>
          </ul>
        </div>
      </ContentCard>

      <ContentCard title={t('hp_adv_card2_title')} tag={t('hp_adv_card2_tag')} tagColor="green">
        <div className="hp-info-row">
          <div className="hp-info-item">
            <div className="hp-info-label">{t('hp_adv_card2_label1')}</div>
            <div className="hp-info-value purple">{t('hp_adv_card2_value1')}</div>
            <div className="hp-info-desc">{t('hp_adv_card2_desc1')}</div>
          </div>
          <div className="hp-info-item">
            <div className="hp-info-label">{t('hp_adv_card2_label2')}</div>
            <div className="hp-info-value">{t('hp_adv_card2_value2')}</div>
            <div className="hp-info-desc">{t('hp_adv_card2_desc2')}</div>
          </div>
        </div>
        <ul className="hp-list-check standalone">
          <li>{t('hp_adv_ctx_1')}</li>
          <li>{t('hp_adv_ctx_2')}</li>
          <li>{t('hp_adv_ctx_3')}</li>
        </ul>
      </ContentCard>
    </div>
  );
};

export default AdvantagePage;
