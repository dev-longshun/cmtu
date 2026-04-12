import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';
import CodeBlock from '../components/CodeBlock';

const VscodePage = ({ serverAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_vsc_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_vsc_title')}</h1>
      <p className="hp-page-desc">{t('hp_vsc_desc')}</p>

      <ContentCard title={t('hp_vsc_prereq')}>
        <ul className="hp-list-check standalone">
          <li>{t('hp_vsc_prereq_1')}</li>
          <li>{t('hp_vsc_prereq_2')}</li>
        </ul>
      </ContentCard>

      <ContentCard title={t('hp_vsc_plugin_info')}>
        <p dangerouslySetInnerHTML={{ __html: t('hp_vsc_plugin_name') }} />
      </ContentCard>

      <ContentCard step={1} title={t('hp_vsc_step1_title')}>
        <p dangerouslySetInnerHTML={{ __html: t('hp_vsc_step1_text') }} />
      </ContentCard>

      <ContentCard step={2} title={t('hp_vsc_step2_title')}>
        <p dangerouslySetInnerHTML={{ __html: t('hp_vsc_step2_text') }} />
        <div className="hp-notice warning" dangerouslySetInnerHTML={{ __html: t('hp_vsc_step2_notice') }} />
      </ContentCard>

      <ContentCard step={3} title={t('hp_vsc_step3_title')}>
        <p>{t('hp_vsc_step3_text')}</p>
        <CodeBlock copyData='{"primaryApiKey":"crs"}'>{`{\n  "primaryApiKey": "crs"\n}`}</CodeBlock>
      </ContentCard>
    </div>
  );
};

export default VscodePage;
