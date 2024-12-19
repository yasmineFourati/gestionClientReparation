import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [role, setRole] = useState(null); // State to hold the role

  // Define the menu items based on the role
  const menuItems = {
    Administrateur: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/client', label: 'Clients' },
      { path: '/demandeRep', label: 'Demandes de réparation' },
      { path: '/repairs', label: 'Réparations' },
      { path: '/catalogue', label: 'Catalogue' },
      { path: '/facture', label: 'Factures' },
    ],
    Chargee_Clientele: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/client', label: 'Clients' },
      { path: '/demandeRep', label: 'Demandes de réparation' },
      { path: '/repairs', label: 'Réparations', disabled: true },
      { path: '/catalogue', label: 'Catalogue' },
      { path: '/facture', label: 'Factures' },
    ],
    Chef_Atelier: [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/client', label: 'Clients', disabled: true },
      { path: '/demandeRep', label: 'Demandes de réparation', disabled: true },
      { path: '/repairs', label: 'Réparations' },
      { path: '/catalogue', label: 'Catalogue' },
      { path: '/facture', label: 'Factures', disabled: true },
    ],
  };

  useEffect(() => {
    // Get the role from localStorage
    const storedRole = localStorage.getItem('role');
    setRole(storedRole); // Set the role in the state
  }, []);

  // Get the menu items based on the role, fallback to an empty array if the role is invalid
  const userMenu = role && menuItems[role] ? menuItems[role] : [];

  return (
    <aside className="fixed w-64 bg-blue-100 text-white h-screen p-5">
      <h1 className="text-xl font-bold mb-6 text-center">RepAppBuro</h1>
      <nav>
        <ul className="space-y-4">
          {userMenu.map((item, index) => (
            <li key={index}>
              <Link
                to={item.disabled ? '#' : item.path} // If disabled, use '#' to make it non-clickable
                className={`block py-2 ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:text-blue-400'}`}
                style={item.disabled ? { pointerEvents: 'none' } : {}}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
