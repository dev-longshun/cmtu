import React, { useState } from 'react';

const TabNav = ({ tabs, children }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="hp-tabs">
      <div className="hp-tab-nav">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`hp-tab-item${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      {React.Children.toArray(children)[active]}
    </div>
  );
};

export default TabNav;
