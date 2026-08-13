import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { HomePage } from './HomePage';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/year/y1" element={<App year="y1" lang="fr" />} />
        <Route path="/year/y2" element={<App year="y2" lang="fr" />} />
        <Route path="/year/y3" element={<App year="y3" lang="fr" />} />
        <Route path="/year/y4" element={<App year="y4" lang="fr" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);