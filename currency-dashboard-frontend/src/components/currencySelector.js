import React, { useState } from 'react';

function CurrencySelector({ onCurrencyChange }) {
    const [baseCurrency, setBaseCurrency] = useState('CAD');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [baseAmount, setBaseAmount] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [rate, setRate] = useState(null);
    const [showRate, setShowRate] = useState(false);
    const currencies = ['USD', 'EUR', 'JPY', 'CAD', 'AUD']; // Example currencies

    const handleSubmit = (event) => {
        event.preventDefault();
        onCurrencyChange(baseCurrency, targetCurrency, setRate);
        setShowRate(true);
    };

    const handleBaseAmountChange = (amount) => {
        setBaseAmount(amount);
        setTargetAmount(amount * rate);
    };

    const handleTargetAmountChange = (amount) => {
        setTargetAmount(amount);
        setBaseAmount(amount / rate);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Base Currency:
                    <select value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)}>
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Target Currency:
                    <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Fetch Rates</button>
            </form>
            {showRate && (
                <>
                    <p>Today's Rate: {rate}</p>
                    <label>
                        Amount in {baseCurrency}:
                        <input type="number" value={baseAmount} onChange={e => handleBaseAmountChange(e.target.value)} />
                    </label>
                    <label>
                        Amount in {targetCurrency}:
                        <input type="number" value={targetAmount} onChange={e => handleTargetAmountChange(e.target.value)} />
                    </label>
                </>
            )}
        </div>
    );
}

export default CurrencySelector;
