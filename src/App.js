// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spin } from 'antd';
import './App.css'; // Import the CSS file
import RegistrationPage from './pages/RegistrationPage';

// Lazy load components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const BusinessList = lazy(() => import('./pages/BusinessList'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CreateBusinessListing = lazy(() => import('./pages/CreateBusinessListing'));
const CreateEventListing = lazy(() => import('./pages/CreateEventListing'));
const EventList = lazy(() => import('./pages/EventList'));
const CreateFranchiseOpportunity = lazy(() => import('./pages/CreateFranchiseListing'));
const FranchiseList = lazy(() => import('./pages/FranchiseList'));
const EditListing = lazy(() => import('./components/EditListing'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const TermsOfUse = lazy(() => import('./components/policy/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./components/policy/PrivacyPolicy'));
const AvoidScams = lazy(() => import('./components/policy/AvoidScams'));

const App = () => {
  return (
    <Router>
      <Navbar />
      <Suspense
        fallback={
          <div className="spin-container">
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path='/success' element={<SuccessPage />} />
          <Route path='register' element={<RegistrationPage />} />
          <Route path="/event-list" element={<EventList />} />
          <Route path="/business-list" element={<BusinessList />} />
          <Route path="/franchises-list" element={<FranchiseList />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/create-business-listing" element={<CreateBusinessListing />} />
          <Route path="/create-event-listing" element={<CreateEventListing />} />
          <Route path="/create-franchise-listing" element={<CreateFranchiseOpportunity />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/avoid-scams" element={<AvoidScams />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
