import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './fonts/icomoon/style.css';
import './css/bootstrap.min.css';
import './css/magnific-popup.css';
import './css/jquery-ui.css';
import './css/owl.carousel.min.css';
import './css/owl.theme.default.min.css';
import './css/bootstrap-datepicker.css';
import './css/animate.css';
import './fonts/flaticon/font/flaticon.css';
import './css/aos.css';
import './css/style.css';

import Signup from './signup/signup';
import HomePage from './homePage/homePage';
import Dashboard from './dashboard/dashboard';
import Summary from './summary/summary';
import Reports from './reports/reports';
const ErrorMessage = () => (
  <div style={{ color: 'red', textAlign: 'center' }}>
    <p>Viewport width is less than 1000 pixels. Please resize your window.</p>
  </div>
);

function App() {
  const [isViewportTooSmall, setIsViewportTooSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      setIsViewportTooSmall(viewportWidth < 1000);
    };

    // Initial check on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isViewportTooSmall) {
    return <ErrorMessage message="Viewport width is less than 1000 pixels. Please resize your window." />;
  }

  return (
    <Router>
      <div className="site-wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
