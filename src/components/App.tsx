import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AuthUtils from '../utils/AuthUtils';
import NavUtils from '../utils/NavUtils';

import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!AuthUtils.hasAccess() && !['/'].includes(window.location.pathname)) {
      return NavUtils.redirectToLogin();
    }
    setIsLoading(false);
  }, [])

  return (
    <div className="bg-slate-300 box-border p-4 min-h-dvh">
      {!isLoading && (
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={
                <Login />
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard />
              }
            />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
