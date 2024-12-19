import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Dashboard from '../src/pages/Dashboard'; 
import ListeClients from './pages/ListeClients';
import ServiceClientele from '../src/pages/ServiceClientele';
import Reparation from './pages/Reparation';
import ListeRep from './pages/ListeRep';
import Facture from './pages/Facture';
import Catalogue from './pages/Catalogue';
import ListeFacture from './pages/ListeFacture';
import DemandeRep from './pages/DemandeRep';
import ListeDemande from './pages/ListeDemande';
import ListeAppareils from './pages/ListeAppareils';
import ClientDash from './pages/ClientDash';
import ReparationDash from './pages/ReparationDash';
import AppareilDash from './pages/AppareilDash';
import { useState, useEffect } from 'react';
// import Sidebar from './components/Sidebarr';



const App = () => {
  const [role, setRole] = useState(null);

useEffect(() => {
  const storedRole = localStorage.getItem('role');
  if (storedRole) {
    setRole(storedRole);
  }
}, []);

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
          <Route path="/facture" element={<Facture />} />
          <Route path="/catalogue" element={<Catalogue />} />
          {/* <Route path="/add-component" element={<AddComponent />} />
          <Route path="/edit-component" element={<EditComponent />} /> */}
          <Route path="/listefac" element={<ListeFacture />} />
          <Route path="/demandeRep" element={<DemandeRep />} />
          <Route path="/listedemande" element={<ListeDemande />} />
          <Route path="/listeapp" element={<ListeAppareils />} />
          <Route path="/clientdash" element={<ClientDash />} />
          <Route path="/appdash" element={<AppareilDash />} />
          <Route path="/repdash" element={<ReparationDash />} />

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
