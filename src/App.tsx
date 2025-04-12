import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LightningProvider } from './contexts/LightningContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import VisualExplainer from './components/visual-explainer/VisualExplainer';
import SetupAssistant from './components/setup-assistant/SetupAssistant';
// import ConnectionSetup from './components/setup-assistant/ConnectionSetup';
import './index.css';

function App() {
  return (
    <LightningProvider demoMode={true}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/visual-explainer" element={<VisualExplainer />} />
              <Route path="/setup" element={<SetupAssistant />} />
              {/* <Route path="/connect" element={<ConnectionSetup />} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </LightningProvider>
  );
}

export default App;