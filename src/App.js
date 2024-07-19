import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import AdminManagementPage from './pages/AdminManagementPage';
import DashboardPage from './pages/DashboardPage';
import TraineesPage from './pages/TraineesPage';
import TrainerPage from './pages/TrainerPage';
import Package from './components/Package';
import PaymentPage from './pages/PaymentPage';

import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import TokenHandler from './components/TokenHandler';


function App() {
  return (
    <BrowserRouter>
      <TokenHandler />
      <Routes>
     
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminManagementPage />} />
        <Route path="/trainer" element={<TrainerPage />} />
        <Route path="/trainees" element={<TraineesPage />} />
        <Route path="/packages" element={<Package />} />
        <Route path="/payments" element={<PaymentPage />} />
        
      </Routes>
   
    </BrowserRouter>
  );
}

export default App;
