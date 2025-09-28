
import React, { useState, useMemo } from 'react';
import { BaseMetalConfig, SilverConfig } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { numberToWords } from '../utils/numberToWords';

interface SilverCalculatorProps {
    baseMetalConfig: BaseMetalConfig;
    silverConfigs: SilverConfig[];
}

interface CalculationResult {
    totalPrice: number;
    rateApplied: number;
    makingCharge: number;
    purchaseRate: number;
}

const SilverCalculator: React.FC<SilverCalculatorProps> = ({ baseMetalConfig, silverConfigs }) => {
    const [weight, setWeight] = useState('');
    const [selectedItemId, setSelectedItemId] = useState<string>(silverConfigs[0]?.id || '');
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [priceInWords, setPriceInWords] = useState<{ english: string; hindi: string } | null>(null);
    const [rateAppliedInWords, setRateAppliedInWords] = useState<{ english: string; hindi: string } | null>(null);
    const [makingChargeInWords, setMakingChargeInWords] = useState<{ english: string; hindi: string } | null>(null);
    const [purchaseRateInWords, setPurchaseRateInWords] = useState<{ english: string; hindi: string } | null>(null);

    const handleCalculate = () => {
        const weightNum = parseFloat(weight);
        const selectedConfig = silverConfigs.find(c => c.id === selectedItemId);

        if (!weightNum || !selectedConfig || weightNum <= 0) {
            setResult(null);
            setPriceInWords(null);
            return;
        }

        const rateAppliedPer10g = baseMetalConfig.silverPricePer10g * (selectedConfig.purity / 100);
        const newRateApplied = rateAppliedPer10g + selectedConfig.addOnPrice;
        const rateAppliedPerGram = newRateApplied / 10;
        const totalSilverValue = weightNum * rateAppliedPerGram;
        const totalPrice = totalSilverValue + selectedConfig.makingCharge;
        const purchaseRate = (rateAppliedPer10g / 10) * weightNum + 500;

        setResult({
            totalPrice,
            rateApplied: rateAppliedPer10g,
            makingCharge: selectedConfig.makingCharge,
            purchaseRate
        });
        setPriceInWords(numberToWords(totalPrice));
        setRateAppliedInWords(numberToWords(newRateApplied));
        setMakingChargeInWords(numberToWords(selectedConfig.makingCharge));
        setPurchaseRateInWords(numberToWords(purchaseRate));
    };

    const selectedConfigDetails = useMemo(() => {
        return silverConfigs.find(c => c.id === selectedItemId);
    }, [selectedItemId, silverConfigs]);


    return (
        <div className="max-w-2xl mx-auto">
            <Card title="Calculate Silver Price">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Weight (in grams)"
                            type="number"
                            placeholder="e.g., 50.2"
                            value={weight}
                            onChange={(e) => {
                                setWeight(e.target.value);
                                setResult(null);
                                setPriceInWords(null);
                            }}
                        />
                        <div>
                            <label htmlFor="silver-type" className="block text-sm font-medium text-gray-600 mb-1">
                                Item Type
                            </label>
                            <select
                                id="silver-type"
                                value={selectedItemId}
                                onChange={(e) => {
                                    setSelectedItemId(e.target.value);
                                    setResult(null);
                                    setPriceInWords(null);
                                }}
                                className="block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                            >
                                {silverConfigs.map(config => (
                                    <option key={config.id} value={config.id}>
                                        {config.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={handleCalculate} disabled={!weight || !selectedItemId || silverConfigs.length === 0}>
                            Calculate Price
                        </Button>
                    </div>

                    {silverConfigs.length === 0 && <p className="text-center text-red-500 text-sm">Please add a silver category in the Configuration tab first.</p>}

                    {result && (
                        <div className="mt-6 p-6 bg-gray-100 border-2 border-gray-200 rounded-lg">
                            <div className="text-center mb-4">
                                <p className="text-lg text-gray-600">Estimated Price</p>
                                <p className="text-4xl font-bold text-gray-800 mt-2">
                                    ₹{result.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                {priceInWords && (
                                    <div className="mt-3 text-center space-y-1">
                                        <p className="font-bold text-gray-700 text-4xl">{priceInWords.hindi}</p>
                                        <p className="font-bold text-gray-700 text-lg">{priceInWords.english}</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-sm text-gray-600 mt-4 pt-4 border-t space-y-4">
                                <div>
                                    <div className="font-bold">Rate Applied:</div>
                                    <div className="font-medium mt-1">₹{result.rateApplied.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / 10g</div>
                                    <div className="font-medium mt-1">{rateAppliedInWords?.hindi}</div>
                                </div>
                                <div>
                                    <div className="font-bold">Making Charge:</div>
                                    <div className="font-medium mt-1">₹{result.makingCharge.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <div className="font-medium mt-1">{makingChargeInWords?.hindi}</div>
                                </div>
                                <div>
                                    <div className="font-bold">Weight:</div>
                                    <div className="font-medium mt-1">{weight} g</div>
                                </div>
                                <div>
                                    <div className="font-bold">Item Type:</div>
                                    <div className="font-medium mt-1">{selectedConfigDetails?.name}</div>
                                </div>
                                <div>
                                    <div className="font-bold">Purchase Rate:</div>
                                    <div className="font-medium mt-1">₹{result.purchaseRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <div className="font-medium mt-1">{purchaseRateInWords?.hindi}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SilverCalculator;
