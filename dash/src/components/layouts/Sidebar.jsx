import React, { useState, useEffect } from "react";
import Logo from "../images/ahaan.png";
import "./header.css";
import { Link } from "react-router-dom";
import Home from '../Home';
import Chat from '../Chat';
import Form from '../Form';
import Timeline from '../Timeline';
import Revision from '../Revision';
import Leaderboard from '../Leaderboard';
import Widget from '../Widget';
import Table from '../Table';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './topheader.css';
import UserProfile from './UserProfile';



const Sidebar = ({authToken, onLogout}) => {
  const [activeTab, setActiveTab] = useState('home');
 
  const navigate = useNavigate();


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="header-container" style={{ display: 'flex', height: '100vh' }}>
        <div className="sidebar" style={{ width: '250px', padding: '20px' }}>
       
         
          <div className="nav" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              <i className="bi bi-house"></i> Home
            </button>
            <button
              className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => handleTabClick('timeline')}
            >
              <i className="bi bi-calendar2-range"></i> Timeline
            </button>
            <button
              className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleTabClick('leaderboard')}
            >
              <i className="bi bi-bar-chart-line-fill"></i> Leaderboard
            </button>
            <button
              className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => handleTabClick('table')}
            >
              <i className="bi bi-table"></i> Table
            </button>
            <button
              className={`tab-button ${activeTab === 'revision' ? 'active' : ''}`}
              onClick={() => handleTabClick('revision')}
            >
              <i className="bi bi-bar-chart-line-fill"></i> Revision
            </button>
            <button
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => handleTabClick('chat')}
            >
              <i className="bi bi-chat-dots"></i> Chat
            </button>
            <button
              className={`tab-button ${activeTab === 'widget' ? 'active' : ''}`}
              onClick={() => handleTabClick('widget')}
            >
              <i className="bi bi-building-check"></i> Widget
            </button>
            <button
              className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => handleTabClick('form')}
            >
              <i className="bi bi-ui-checks"></i> Form
            </button>
          </div>
          <hr />
          <div className="nav-links">
            <Link to="#" className="nav-link text-white">
              <i className="bi bi-gear"></i> Settings
            </Link>
            <Link to="/sales-support" className="nav-link text-white">
              <i className="bi bi-info-circle"></i> Support
            </Link>
          </div>
        </div>

        <div className="tab-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'home' && <Home />}
          {activeTab === 'chat' && <Chat />}
          {activeTab === 'form' && <Form />}
          {activeTab === 'timeline' && <Timeline />}
          {activeTab === 'revision' && <Revision />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'widget' && <Widget />}
          {activeTab === 'table' && <Table />}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
