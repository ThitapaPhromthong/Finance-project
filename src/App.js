import './App.css';
import axios from 'axios'
import { useState } from 'react';
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => setIsAuthenticated(true)

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={!isAuthenticated ? <LoginScreen onLoginSuccess={handleLoginSuccess} /> : null} />
            <Route path="/finance" element={isAuthenticated ? <FinanceScreen /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
