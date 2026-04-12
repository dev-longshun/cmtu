import React from 'react';
import StepNumber from './StepNumber';

const ContentCard = ({ step, title, tag, tagColor, children }) => (
  <div className="hp-card">
    <div className="hp-card-header">
      {step && <StepNumber number={step} />}
      <h2>{title}</h2>
      {tag && <span className={`hp-tag ${tagColor || 'purple'}`}>{tag}</span>}
    </div>
    {children}
  </div>
);

export default ContentCard;
