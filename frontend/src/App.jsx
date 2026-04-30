import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ContentPage from './components/ContentPage';
import DocumentSimplifier from './components/DocumentSimplifier';
import VoiceAssistant from './components/VoiceAssistant';
import LawLibrary from './components/LawLibrary';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="app" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="simplify" element={<DocumentSimplifier />} />
          <Route path="voice" element={<VoiceAssistant />} />
          <Route path="consultations" element={
            <ContentPage title="Consultations" label="Services">
              <p>Schedule a 1-on-1 consultation with our vetted legal experts. Select a date and time that works for you, and we will pair you with a professional specializing in your case's jurisdiction.</p>
              <h3 className="font-h3 text-on-surface mt-6">Available Experts</h3>
              <ul className="list-disc pl-5">
                <li>Adv. Sharma (Family Law) - Available Tomorrow</li>
                <li>Adv. Gupta (Corporate Law) - Available Friday</li>
                <li>Adv. Menon (Criminal Law) - Available Next Week</li>
              </ul>
            </ContentPage>
          } />
          <Route path="library" element={<LawLibrary />} />
          <Route path="tracking" element={
            <ContentPage title="Case Tracking" label="Portal">
              <p>Track the status of your ongoing legal disputes. Upload new documents, review lawyer updates, and stay informed on upcoming hearing dates.</p>
              <div className="bg-surface-variant p-4 mt-4 rounded border-l-4 border-secondary">
                <p><strong>Case #RS-2026-904:</strong> Status pending. Awaiting response from the respondent.</p>
              </div>
            </ContentPage>
          } />
          <Route path="terms" element={
            <ContentPage title="Legal Terms" label="Agreements">
              <p>By using RightSpeak, you agree to these terms of service. RightSpeak provides informational analysis only and does not establish an attorney-client relationship. All AI-generated advice must be independently verified by a licensed legal practitioner.</p>
            </ContentPage>
          } />
          <Route path="privacy" element={
            <ContentPage title="Privacy Policy" label="Agreements">
              <p>Your data privacy is our paramount concern. All queries processed through RightSpeak are anonymized and encrypted. We do not sell your personal information to third-party data brokers.</p>
            </ContentPage>
          } />
          <Route path="compliance" element={
            <ContentPage title="Regulatory Compliance" label="Agreements">
              <p>RightSpeak adheres to the highest standards of regulatory compliance, including the Digital Personal Data Protection Act, 2023. Our models are aligned to prevent the unauthorized practice of law.</p>
            </ContentPage>
          } />
          <Route path="experts" element={
            <ContentPage title="Contact Expert" label="Network">
              <p>Fill out our secure intake form and one of our intake specialists will contact you within 24 hours to match you with the right legal expert.</p>
            </ContentPage>
          } />
          <Route path="login" element={
            <ContentPage title="Log In" label="Authentication">
              <p>Please sign in using your IBM App ID to access your encrypted dashboard.</p>
              <div className="mt-8 flex flex-col gap-4 max-w-sm">
                <button 
                  onClick={async () => {
                    const { loginWithAppId } = await import('./services/auth');
                    const result = await loginWithAppId();
                    if (result) {
                      alert(`Successfully logged in as ${result.userInfo.name || result.userInfo.email}`);
                      window.location.href = '/dashboard';
                    }
                  }}
                  className="bg-primary-container text-on-primary py-3 rounded mt-2 font-medium shadow hover:bg-opacity-90 transition-all">
                  Sign In with IBM App ID
                </button>
              </div>
            </ContentPage>
          } />
        </Route>
      </Routes>
    </Router>
  );
}
