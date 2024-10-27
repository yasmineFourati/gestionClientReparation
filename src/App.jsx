import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Dashboard from '../src/pages/Dashboard'; 
import ListeClients from './pages/ListeClients';
import ServiceClientele from '../src/pages/ServiceClientele';
import Reparation from './pages/Reparation';
import ListeRep from './pages/ListeRep';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client" element={<ServiceClientele />} />
          <Route path="/listeclient" element={<ListeClients />} />
          <Route path="/repairs" element={<Reparation />} />
          <Route path="/listerep" element={<ListeRep />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
