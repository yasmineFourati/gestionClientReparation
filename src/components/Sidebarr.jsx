// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed w-64 bg-blue-100 text-white h-screen p-5">
      <h1 className="text-xl font-bold mb-6 text-center">RepAppBuro</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="block py-2 hover:text-blue-400">Tableau de bord</Link>
          </li>
          <li>
            <Link to="/client" className="block py-2 hover:text-blue-400">Clients</Link>
          </li>
          <li>
            <Link to="/repairs" className="block py-2 hover:text-blue-400">Réparations</Link>
          </li>
          <li>
            <Link to="/invoices" className="block py-2 hover:text-blue-400">Factures</Link>
          </li>
          {/* <li>
            <Link to="/statistics" className="block py-2 hover:text-blue-400">Statistiques</Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
