import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';
import { HomePage } from './HomePage';
import App from './App';

type Language = 'fr' | 'en' | 'ar';

function Root() {
  const [lang, setLang] = useState<Language>('fr');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage lang={lang} onLanguageChange={setLang} />} />
        <Route path="/year1" element={<App year="y1" lang={lang} onLanguageChange={setLang} />} />
        <Route path="/year2" element={<App year="y2" lang={lang} onLanguageChange={setLang} />} />
        <Route path="/year3" element={<App year="y3" lang={lang} onLanguageChange={setLang} />} />
        <Route path="/year4" element={<App year="y4" lang={lang} onLanguageChange={setLang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
