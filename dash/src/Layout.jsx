import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import Footer from './components/layouts/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TopHeader from './components/layouts/TopHeader';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';  // Import the PrivateRoute

function Layout({ authToken, authTokenMember, onLogout }) {
  return (
    <div>
      <TopHeader authToken={authToken || authTokenMember} onLogout={onLogout} />
      
      {(authToken || authTokenMember) ? ( 
        <>
          <Sidebar authToken={authToken || authTokenMember} onLogout={onLogout}/>
          <div className="main-content">
            <ToastContainer />
            <Routes>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
             
            </Routes>
          </div>
          <Footer />
        </>
      ) : (
        <div className="container">
          <h3>Please log in to access the dashboard.</h3>
        </div>
      )}
    </div>
  );
}

export default Layout;
