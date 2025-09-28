import React, { useState, useEffect } from 'react';
import { BaseMetalConfig, GoldConfig, SilverConfig } from './types';
import Configuration from './components/Configuration';
import GoldCalculator from './components/GoldCalculator';
import SilverCalculator from './components/SilverCalculator';
import Tabs from './components/common/Tabs';

const CONFIG_STORAGE_KEY = 'jewelleryCalculatorConfig';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Configuration');

  const [baseMetalConfig, setBaseMetalConfig] = useState<BaseMetalConfig>({
    goldPricePer10g: 118000,
    silverPricePer10g: 1200,
  });

  const [goldConfigs, setGoldConfigs] = useState<GoldConfig[]>([
    { id: '1', name: '916 KDM', purity: 91.6, addOnPrice: 5000, makingCharge: 800 },
    { id: '2', name: '750 KDM', purity: 75.0, addOnPrice: 6500, makingCharge: 550 },
  ]);

  const [silverConfigs, setSilverConfigs] = useState<SilverConfig[]>([
    { id: 's1', name: 'Payal MRDX', purity: 56, addOnPrice: 200, makingCharge: 250 },
    { id: 's2', name: 'Payal SC-70', purity: 70.0, addOnPrice: 200, makingCharge: 250 },
  ]);

  // Load config from localStorage on initial render
  useEffect(() => {
    try {
      const savedConfigJSON = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfigJSON) {
        const savedConfig = JSON.parse(savedConfigJSON);
        if (savedConfig.baseMetalConfig) setBaseMetalConfig(savedConfig.baseMetalConfig);
        if (savedConfig.goldConfigs) setGoldConfigs(savedConfig.goldConfigs);
        if (savedConfig.silverConfigs) setSilverConfigs(savedConfig.silverConfigs);
      }
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      const configToSave = {
        baseMetalConfig,
        goldConfigs,
        silverConfigs,
      };
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configToSave));
      // FIX: Added curly braces to the catch block to fix a syntax error.
    } catch (error) {
      console.error("Failed to save config to localStorage", error);
    }
  }, [baseMetalConfig, goldConfigs, silverConfigs]);


  const tabContent = () => {
    switch (activeTab) {
      case 'Configuration':
        return (
          <Configuration
            baseMetalConfig={baseMetalConfig}
            setBaseMetalConfig={setBaseMetalConfig}
            goldConfigs={goldConfigs}
            setGoldConfigs={setGoldConfigs}
            silverConfigs={silverConfigs}
            setSilverConfigs={setSilverConfigs}
          />
        );
      case 'Gold Calculator':
        return (
          <GoldCalculator
            baseMetalConfig={baseMetalConfig}
            goldConfigs={goldConfigs}
          />
        );
      case 'Silver Calculator':
        return (
          <SilverCalculator
            baseMetalConfig={baseMetalConfig}
            silverConfigs={silverConfigs}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:h-20">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 mb-4 sm:mb-0 text-center">
              Khatri Alankar
            </h1>
            <Tabs
              tabs={['Configuration', 'Gold Calculator', 'Silver Calculator']}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {tabContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Built with precision and elegance.</p>
      </footer>
    </div>
  );
};

export default App;