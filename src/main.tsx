import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { HomePage } from './HomePage';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

type Language = 'fr' | 'en' | 'ar';

function Root() {
  const [lang, setLang] = useState<Language>('fr');

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage lang={lang} onLanguageChange={setLang} />} />
          <Route path="/year/y1" element={<App year="y1" lang={lang} />} />
          <Route path="/year/y2" element={<App year="y2" lang={lang} />} />
          <Route path="/year/y3" element={<App year="y3" lang={lang} />} />
          <Route path="/year/y4" element={<App year="y4" lang={lang} />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

root.render(<Root />);