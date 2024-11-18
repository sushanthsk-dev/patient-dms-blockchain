import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, DocumentTextIcon, PencilIcon, ShieldCheckIcon } from '@heroicons/react/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);  // To toggle sidebar visibility
  const location = useLocation();

  // Toggle Sidebar visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Helper function to determine if the link is active
  const isActive = (path) => location.pathname === path ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100';

  return (
    <div className={`flex ${isOpen ? 'w-256' : 'w-20'} h-full h-screen transition-all duration-300`}>
      {/* Sidebar */}
      <div className="bg-gray-800 text-white h-full flex flex-col p-4 space-y-4">
        {/* Toggle Button (Hamburger) */}
        <div className="flex justify-between items-center mb-4">
          {/* <button onClick={toggleSidebar} className="text-white">
            {isOpen ? '⮞' : '☰'}
          </button> */}
          <h2 className={`font-bold ${isOpen ? 'text-xl' : 'text-sm'} transition-all duration-300`}>AJ Hospital</h2>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-2">
          {/* Dashboard Link */}
          {localStorage.getItem('role') === "admin" && <Link
            to="/"
            className={`p-2 rounded-md flex items-center ${isActive('/')}`}
          >
            <HomeIcon className={`h-6 w-6 mr-3 ${isActive('/')}`} />
            {isOpen && 'Dashboard'}
          </Link>}

          {/* Manage Doctors Link */}
         {localStorage.getItem('role') === "admin" && <Link
            to="/doctor-management"
            className={`p-2 rounded-md flex items-center ${isActive('/doctor-management')}`}
          >
            <UserIcon className={`h-6 w-6 mr-3 ${isActive('/doctor-management')}`} />
            {isOpen && 'Manage Doctors'}
          </Link>}
          {/* Patients Link */}
          <Link
            to="/patients"
            className={`p-2 rounded-md flex items-center ${isActive('/patients')}`}
          >
            <DocumentTextIcon className={`h-6 w-6 mr-3 ${isActive('/patients')}`} />
            {isOpen && 'Manage Patients'}
          </Link>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Main content will go here */}
      </div>
    </div>
  );
};

export default Sidebar;
