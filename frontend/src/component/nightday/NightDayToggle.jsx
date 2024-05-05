import React, { useState, useEffect } from 'react';
import { Switch } from 'antd';

const NightAndDay = () => {
  // State to keep track of the current theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle between light and dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Use useEffect to apply the theme when the component mounts or when the theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="toggle-container">
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      {/* Your app content here */}
    </div>
  );
};

export default NightAndDay;
