import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import RealEstate from './components/RealEstate';
import Simulator from './components/Simulator';

type Tab = 'dashboard' | 'portfolio' | 'realestate' | 'simulator';

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'realestate', label: 'Inmuebles' },
  { id: 'simulator', label: 'Simulador' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold text-white tracking-tight">Wealth Manager</h1>
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'realestate' && <RealEstate />}
        {activeTab === 'simulator' && <Simulator />}
      </main>
    </div>
  );
}
