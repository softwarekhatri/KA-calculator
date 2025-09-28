
import React, { useState, useRef } from 'react';
import { BaseMetalConfig, GoldConfig, SilverConfig } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

interface ConfigurationProps {
  baseMetalConfig: BaseMetalConfig;
  setBaseMetalConfig: React.Dispatch<React.SetStateAction<BaseMetalConfig>>;
  goldConfigs: GoldConfig[];
  setGoldConfigs: React.Dispatch<React.SetStateAction<GoldConfig[]>>;
  silverConfigs: SilverConfig[];
  setSilverConfigs: React.Dispatch<React.SetStateAction<SilverConfig[]>>;
}

const Configuration: React.FC<ConfigurationProps> = ({
  baseMetalConfig,
  setBaseMetalConfig,
  goldConfigs,
  setGoldConfigs,
  silverConfigs,
  setSilverConfigs,
}) => {
  const [isGoldPriceLocked, setIsGoldPriceLocked] = useState(true);
  const [isSilverPriceLocked, setIsSilverPriceLocked] = useState(true);

  const [newGoldItem, setNewGoldItem] = useState({ name: '', purity: '', addOnPrice: '', makingCharge: '' });
  const [editingGoldId, setEditingGoldId] = useState<string | null>(null);

  const [newSilverItem, setNewSilverItem] = useState({ name: '', purity: '', addOnPrice: '', makingCharge: '' });
  const [editingSilverId, setEditingSilverId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseMetalConfig(prev => ({ ...prev, [e.target.name]: e.target.valueAsNumber || 0 }));
  };

  const handleGoldFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, purity, makingCharge } = newGoldItem;
    if (name && purity && makingCharge) {
      const parsedItem = {
        name,
        purity: parseFloat(purity),
        makingCharge: parseFloat(makingCharge),
        addOnPrice: parseFloat(newGoldItem.addOnPrice),
      };

      if (editingGoldId) {
        setGoldConfigs(prev => prev.map(item => item.id === editingGoldId ? { ...item, ...parsedItem } : item));
        setEditingGoldId(null);
      } else {
        const newItem: GoldConfig = { id: `g${Date.now()}`, ...parsedItem };
        setGoldConfigs(prev => [...prev, newItem]);
      }
      setNewGoldItem({ name: '', purity: '', makingCharge: '', addOnPrice: '' });
    }
  };

  const editGoldItem = (item: GoldConfig) => {
    setEditingGoldId(item.id);
    setNewGoldItem({
      name: item.name,
      purity: String(item.purity),
      makingCharge: String(item.makingCharge),
      addOnPrice: String(item.addOnPrice),
    });
  };

  const cancelEditGold = () => {
    setEditingGoldId(null);
    setNewGoldItem({ name: '', purity: '', makingCharge: '', addOnPrice: '' });
  };

  const removeGoldItem = (id: string) => {
    if (editingGoldId === id) cancelEditGold();
    setGoldConfigs(prev => prev.filter(item => item.id !== id));
  };

  const handleSilverFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, purity, makingCharge } = newSilverItem;
    if (name && purity && makingCharge) {
      const parsedItem = {
        name,
        purity: parseFloat(purity),
        makingCharge: parseFloat(makingCharge),
        addOnPrice: parseFloat(makingCharge),
      };

      if (editingSilverId) {
        setSilverConfigs(prev => prev.map(item => item.id === editingSilverId ? { ...item, ...parsedItem } : item));
        setEditingSilverId(null);
      } else {
        const newItem: SilverConfig = { id: `s${Date.now()}`, ...parsedItem };
        setSilverConfigs(prev => [...prev, newItem]);
      }
      setNewSilverItem({ name: '', purity: '', makingCharge: '', addOnPrice: '' });
    }
  };

  const editSilverItem = (item: SilverConfig) => {
    setEditingSilverId(item.id);
    setNewSilverItem({
      name: item.name,
      purity: String(item.purity),
      makingCharge: String(item.makingCharge),
      addOnPrice: String(item.addOnPrice)
    });
  };

  const cancelEditSilver = () => {
    setEditingSilverId(null);
    setNewSilverItem({ name: '', purity: '', makingCharge: '', addOnPrice: '' });
  };

  const removeSilverItem = (id: string) => {
    if (editingSilverId === id) cancelEditSilver();
    setSilverConfigs(prev => prev.filter(item => item.id !== id));
  };

  const handleExport = () => {
    const configData = JSON.stringify({ baseMetalConfig, goldConfigs, silverConfigs }, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jewellery-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File is not readable");
        const importedConfig = JSON.parse(text);

        if (importedConfig.baseMetalConfig && importedConfig.goldConfigs && importedConfig.silverConfigs) {
          setBaseMetalConfig(importedConfig.baseMetalConfig);
          setGoldConfigs(importedConfig.goldConfigs);
          setSilverConfigs(importedConfig.silverConfigs);
          alert("Configuration imported successfully!");
        } else {
          throw new Error("Invalid config file format.");
        }
      } catch (error) {
        alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <Card title="Data Management">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport}>Export Config (JSON)</Button>
          <Button onClick={handleImportClick} variant="secondary">Import Config (JSON)</Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gold Configuration */}
        <Card title="Gold Configuration">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <Input
                  label="24 Karat Price (per 10g)"
                  type="number"
                  name="goldPricePer10g"
                  value={baseMetalConfig.goldPricePer10g}
                  onChange={handleBaseChange}
                  disabled={isGoldPriceLocked}
                />
              </div>
              <Button
                variant={isGoldPriceLocked ? 'secondary' : 'primary'}
                onClick={() => setIsGoldPriceLocked(prev => !prev)}
              >
                {isGoldPriceLocked ? 'Update' : 'Save'}
              </Button>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Gold Types</h3>
              {goldConfigs.length > 0 ? (
                <ul className="space-y-2">
                  {goldConfigs.map(item => (
                    <li key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-0 sm:ml-4">{item.purity}% Pure</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
                        <span className="text-sm text-gray-600">Price+: ₹{item.addOnPrice.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-gray-600">Making: ₹{item.makingCharge.toLocaleString('en-IN')}</span>
                        <Button variant="secondary" onClick={() => editGoldItem(item)} className="px-2 py-1 text-xs">Edit</Button>
                        <Button variant="danger" onClick={() => removeGoldItem(item.id)} className="px-2 py-1 text-xs">Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500 text-sm">No gold types defined yet.</p>}
            </div>
            <form onSubmit={handleGoldFormSubmit} className="space-y-3 pt-4 border-t mt-4">
              <h3 className="text-md font-medium text-gray-800">{editingGoldId ? 'Edit Gold Type' : 'Add New Gold Type'}</h3>
              <Input label="Type Name (e.g., 585 KDM)" type="text" value={newGoldItem.name} onChange={e => setNewGoldItem({ ...newGoldItem, name: e.target.value })} required />
              <Input label="Purity (%)" type="number" step="0.1" value={newGoldItem.purity} onChange={e => setNewGoldItem({ ...newGoldItem, purity: e.target.value })} required />
              <Input label="Add on Price (Rs.)" type="number" step="0.1" value={newGoldItem.addOnPrice} onChange={e => setNewGoldItem({ ...newGoldItem, addOnPrice: e.target.value })} required />
              <Input label="Making Charge (₹)" type="number" step="0.01" value={newGoldItem.makingCharge} onChange={e => setNewGoldItem({ ...newGoldItem, makingCharge: e.target.value })} required />
              <div className="flex gap-2">
                <Button type="submit">{editingGoldId ? 'Update Type' : 'Add Type'}</Button>
                {editingGoldId && <Button variant="secondary" onClick={cancelEditGold}>Cancel</Button>}
              </div>
            </form>
          </div>
        </Card>

        {/* Silver Configuration */}
        <Card title="Silver Configuration">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <Input
                  label="Pure Silver Price (per 10g)"
                  type="number"
                  name="silverPricePer10g"
                  value={baseMetalConfig.silverPricePer10g}
                  onChange={handleBaseChange}
                  disabled={isSilverPriceLocked}
                />
              </div>
              <Button
                variant={isSilverPriceLocked ? 'secondary' : 'primary'}
                onClick={() => setIsSilverPriceLocked(prev => !prev)}
              >
                {isSilverPriceLocked ? 'Update' : 'Save'}
              </Button>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Silver Item Categories</h3>
              {silverConfigs.length > 0 ? (
                <ul className="space-y-2">
                  {silverConfigs.map(item => (
                    <li key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-0 sm:ml-4">{item.purity}% Pure</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
                        <span className="text-sm text-gray-600">Price+: ₹{item.addOnPrice.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-gray-600">Making: ₹{item.makingCharge.toLocaleString('en-IN')}</span>
                        <Button variant="secondary" onClick={() => editSilverItem(item)} className="px-2 py-1 text-xs">Edit</Button>
                        <Button variant="danger" onClick={() => removeSilverItem(item.id)} className="px-2 py-1 text-xs">Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500 text-sm">No silver categories defined yet.</p>}
            </div>
            <form onSubmit={handleSilverFormSubmit} className="space-y-3 pt-4 border-t mt-4">
              <h3 className="text-md font-medium text-gray-800">{editingSilverId ? 'Edit Silver Category' : 'Add New Silver Category'}</h3>
              <Input label="Item Name (e.g., Payal Sukh-70)" type="text" value={newSilverItem.name} onChange={e => setNewSilverItem({ ...newSilverItem, name: e.target.value })} required />
              <Input label="Purity (%)" type="number" step="0.1" value={newSilverItem.purity} onChange={e => setNewSilverItem({ ...newSilverItem, purity: e.target.value })} required />
              <Input label="Add on Price (Rs.)" type="number" step="0.1" value={newSilverItem.addOnPrice} onChange={e => setNewSilverItem({ ...newSilverItem, addOnPrice: e.target.value })} required />
              <Input label="Making Charge (₹)" type="number" step="0.01" value={newSilverItem.makingCharge} onChange={e => setNewSilverItem({ ...newSilverItem, makingCharge: e.target.value })} required />
              <div className="flex gap-2">
                <Button type="submit">{editingSilverId ? 'Update Category' : 'Add Category'}</Button>
                {editingSilverId && <Button variant="secondary" onClick={cancelEditSilver}>Cancel</Button>}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Configuration;
