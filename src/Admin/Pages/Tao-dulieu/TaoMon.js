import React from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './Tao-dulieu.css'; 

function TaoMon() {
    return (
        <div className="container">
            <div style={{ display: 'flex' }}>
                <SidebarAdmin />
                <div className="content">
                    <h1>TaoMon</h1>
                </div>
            </div>
        </div>
    );
}

export default TaoMon;