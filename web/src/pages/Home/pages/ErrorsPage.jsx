import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '../components/ContentCard';
import CodeBlock from '../components/CodeBlock';

const ErrorsPage = ({ serverAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="hp-page">
      <div className="hp-breadcrumb">
        <a href={serverAddress}>{t('hp_nav_home')}</a>
        <span className="hp-breadcrumb-sep">/</span>
        <span>{t('hp_err_breadcrumb')}</span>
      </div>
      <h1 className="hp-page-title">{t('hp_err_title')}</h1>
      <p className="hp-page-desc">{t('hp_err_desc')}</p>

      <ContentCard title={t('hp_err_prereq')}>
        <ul className="hp-list-check standalone">
          <li>{t('hp_err_prereq_1')}</li>
          <li>{t('hp_err_prereq_2')}</li>
          <li>{t('hp_err_prereq_3')}</li>
        </ul>
      </ContentCard>

      <ContentCard title={t('hp_err_problem_title')}>
        <p>{t('hp_err_problem_desc')}</p>
        <CodeBlock>{`Unable to connect to Anthropic services\nFailed to connect to api.anthropic.com: ERR_BAD_REQUEST`}</CodeBlock>
      </ContentCard>

      <ContentCard title={t('hp_err_solution_title')}>
        <div className="hp-faq-step">
          <span>{t('hp_err_step1_label')}</span>
          {t('hp_err_step1_text')}
        </div>
        <p dangerouslySetInnerHTML={{ __html: t('hp_err_step1_desc') }} />

        <div className="hp-faq-step">
          <span>{t('hp_err_step2_label')}</span>
          {t('hp_err_step2_text')}
        </div>
        <p>{t('hp_err_step2_desc')}</p>
        <CodeBlock>{`"hasCompletedOnboarding": true`}</CodeBlock>
        <p>{t('hp_err_step2_extra')}</p>

        <div className="hp-faq-step">
          <span>{t('hp_err_step3_label')}</span>
          {t('hp_err_step3_text')}
        </div>
      </ContentCard>
    </div>
  );
};

export default ErrorsPage;
