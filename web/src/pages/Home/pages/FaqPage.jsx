import React from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/Accordion';

const FaqPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  const items = [
    {
      title: t('hp_faq_q1'),
      content: (
        <>
          <div className="hp-faq-step"><span>{t('hp_faq_q1_s1_label')}</span>{t('hp_faq_q1_s1')}</div>
          <div className="hp-faq-step"><span>{t('hp_faq_q1_s2_label')}</span>{t('hp_faq_q1_s2')}</div>
          <div className="hp-faq-step"><span>{t('hp_faq_q1_s3_label')}</span>{t('hp_faq_q1_s3')}</div>
          <div className="hp-faq-step"><span>{t('hp_faq_q1_s4_label')}</span>{t('hp_faq_q1_s4')}</div>
        </>
      ),
    },
    {
      title: t('hp_faq_q2'),
      content: (
        <>
          <p>{t('hp_faq_q2_intro')}</p>
          <div className="hp-model-list">
            <div className="hp-model-item">
              <span className="hp-model-name">{t('hp_faq_q2_m1_name')}</span>
              <span className="hp-model-desc">{t('hp_faq_q2_m1_desc')}</span>
            </div>
            <div className="hp-model-item">
              <span className="hp-model-name">{t('hp_faq_q2_m2_name')}</span>
              <span className="hp-model-desc">{t('hp_faq_q2_m2_desc')}</span>
            </div>
            <div className="hp-model-item">
              <span className="hp-model-name">{t('hp_faq_q2_m3_name')}</span>
              <span className="hp-model-desc">{t('hp_faq_q2_m3_desc')}</span>
            </div>
          </div>
          <div className="hp-faq-highlight" dangerouslySetInnerHTML={{ __html: t('hp_faq_q2_price') }} />
        </>
      ),
    },
    {
      title: t('hp_faq_q3'),
      content: <p>{t('hp_faq_q3_a')}</p>,
    },
    {
      title: t('hp_faq_q4'),
      content: <p>{t('hp_faq_q4_a')}</p>,
    },
  ];

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_faq_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_faq_title')}</h1>
      <p className="hp-page-desc">{t('hp_faq_desc')}</p>
      <Accordion items={items} />
    </div>
  );
};

export default FaqPage;
