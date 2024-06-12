import React, { useState } from 'react';

const currencies = [
    { code: 'USD', name: 'United States', flag: 'https://flagcdn.com/us.svg' },
    { code: 'EUR', name: 'Euro', flag: 'https://flagcdn.com/eu.svg' },
    { code: 'CAD', name: 'Canada', flag: 'https://flagcdn.com/ca.svg' },
    { code: 'CNY', name: 'China', flag: 'https://flagcdn.com/cn.svg' },
    { code: 'JPY', name: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
    { code: 'AUD', name: 'Australia', flag: 'https://flagcdn.com/au.svg' }
];

function CurrencySelector({ onCurrencyChange }) {
    const [baseCurrency, setBaseCurrency] = useState(currencies[2]);
    const [targetCurrency, setTargetCurrency] = useState(currencies[0]);
    const [baseAmount, setBaseAmount] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [rate, setRate] = useState(null);
    const [showRate, setShowRate] = useState(false);
    const [isOpenBase, setIsOpenBase] = useState(false);
    const [isOpenTarget, setIsOpenTarget] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        onCurrencyChange(baseCurrency.code, targetCurrency.code, setRate);
        setShowRate(true);
    };

    const handleBaseAmountChange = (amount) => {
        setBaseAmount(amount);
        setTargetAmount((amount * rate).toFixed(2));
    };

    const handleTargetAmountChange = (amount) => {
        setTargetAmount(amount);
        setBaseAmount( (amount / rate).toFixed(2));
    };

    const handleBaseSelect = (currency) => {
        setBaseCurrency(currency);
        setRate(null);
        setTargetAmount('');
        setIsOpenBase(false);
    };

    const handleTargetSelect = (currency) => {
        setTargetCurrency(currency);
        setRate(null);
        setTargetAmount('');
        setIsOpenTarget(false);
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-4 p-4 my-4 transition-all duration-500">
            <form onSubmit={handleSubmit} className={`flex items-center space-x-3 ${showRate ? 'mb-12' : ''} transition-all duration-500`}>
                <div className="relative z-10">
                    <button
                        type="button"
                        onClick={() => setIsOpenBase(!isOpenBase)}
                        className="focus:ring hovcard rounded-full inline-block px-8 py-6 bg-white border-4 border-yellow-500 shadow-sm text-gray-700 text-sm"
                    >
                        <img className="inline-block mr-2" src={baseCurrency.flag} alt={baseCurrency.name} width="32" height="32" />
                        {baseCurrency.code} <span className="ml-2">▼</span>
                    </button>
                    {isOpenBase && (
                        <ul className="dropdownoptions absolute rounded-lg overflow-auto max-h-48 p-2 bg-white shadow border border-gray-300 w-full z-10">
                            {currencies.filter(currency => currency.code !== targetCurrency).map(currency => (
                                <li
                                    key={currency.code}
                                    className="hover:ring cursor-pointer rounded-lg flex items-center p-2"
                                    onClick={() => handleBaseSelect(currency)}
                                >
                                    <img className="rounded inline-block align-middle mr-2" src={currency.flag} width="32" height="32" alt={currency.name} />
                                    <div className="align-middle inline-block text-sm">
                                        {currency.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button type="submit" className="px-8 py-6 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Fetch Rates
                </button>

                <div className="relative z-10">
                    <button
                        type="button"
                        onClick={() => setIsOpenTarget(!isOpenTarget)}
                        className="focus:ring hovcard rounded-full inline-block px-8 py-6 bg-white border-4 border-yellow-500 shadow-sm text-gray-700 text-sm"
                    >
                        <img className="inline-block mr-2" src={targetCurrency.flag} alt={targetCurrency.name} width="32" height="32" />
                        {targetCurrency.code} <span className="ml-2">▼</span>
                    </button>
                    {isOpenTarget && (
                        <ul className="dropdownoptions absolute rounded-lg overflow-auto max-h-48 p-2 bg-white shadow border border-gray-300 w-full z-10">
                            {currencies.filter(currency => currency.code !== baseCurrency).map(currency => (
                                <li
                                    key={currency.code}
                                    className="hover:ring cursor-pointer rounded-lg flex items-center p-2"
                                    onClick={() => handleTargetSelect(currency)}
                                >
                                    <img className="rounded inline-block align-middle mr-2" src={currency.flag} width="32" height="32" alt={currency.name} />
                                    <div className="align-middle inline-block text-sm">
                                        {currency.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
            {showRate && (
                <div className={`flex flex-col items-center space-y-4 mt-4 transition-all duration-500 ${showRate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-2xl text-white">Today's Rate: <span className="text-4xl text-green-500 font-bold">{rate}</span></p>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <img className="absolute left-2 top-2" src={baseCurrency.flag} alt={baseCurrency.name} width="24" height="24" />
                            <input 
                                type="number" 
                                value={baseAmount} 
                                onChange={e => handleBaseAmountChange(e.target.value)} 
                                className="form-input mt-1 block w-40 pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder={`Amount in ${baseCurrency.code}`}
                            />
                        </div>
                        <div className="relative">
                            <img className="absolute left-2 top-2" src={targetCurrency.flag} alt={targetCurrency.name} width="24" height="24" />
                            <input 
                                type="number" 
                                value={targetAmount} 
                                onChange={e => handleTargetAmountChange(e.target.value)} 
                                className="form-input mt-1 block w-40 pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder={`Amount in ${targetCurrency.code}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrencySelector;
