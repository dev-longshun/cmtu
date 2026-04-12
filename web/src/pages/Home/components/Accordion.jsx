import React, { useState } from 'react';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="hp-accordion">
      {items.map((item, i) => (
        <div key={i} className={`hp-accordion-item${i === activeIndex ? ' active' : ''}`}>
          <div className="hp-accordion-header" onClick={() => setActiveIndex(i === activeIndex ? -1 : i)}>
            <h3>{item.title}</h3>
            <span className="hp-accordion-arrow" />
          </div>
          <div className="hp-accordion-content">
            <div className="hp-accordion-body">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
