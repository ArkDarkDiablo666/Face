// src/trangchu/DashboardGuest.js
import React from 'react';
import SidebarGuest from './SidebarGuest';
import './Guest.css';

function Guest() {
  return (
    <div className="container">
      <SidebarGuest /> 
      <div className='content'>
        <h1>Guest</h1>
      </div>
    </div>
  );
}

export default Guest;