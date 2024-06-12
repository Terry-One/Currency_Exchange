import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/header';
import Footer from './components/footer';
import CurrencySelector from './components/currencySelector';
import CurrencyChart from './components/currencyChart';
import CurrencyGrid from './components/currencyGrid';

function App() {
    const [baseCurrency, setBaseCurrency] = useState('CAD');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [showComponents, setShowComponents] = useState(false); // To control visibility of Grid/Chart
    const [showChart, setShowChart] = useState(false); // To toggle between chart and grid

    const handleCurrencyChange = (base, target, setRate) => {
        const apiUrl = `http://localhost:8000/api/fetch-historical/?base=${base}&target=${target}`;
        axios.get(apiUrl)
            .then(response => {
                // Assuming the response structure and setting rates if needed elsewhere
                setRate(response.data.today_rate.rate);
                setBaseCurrency(base);
                setTargetCurrency(target);
                setShowComponents(true); // Show grid/chart after fetching data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setShowComponents(false); // Hide components if there's an error
            });
    };

    const toggleView = () => {
        setShowChart(!showChart); // Toggle between chart and grid
    };

    return (
        <div className="App">
            <Header />
            <CurrencySelector onCurrencyChange={handleCurrencyChange} />
            {showComponents && (
                <>
                    <button onClick={toggleView}>
                        {showChart ? "Show Grid" : "Show Chart"}
                    </button>
                    {showChart ? 
                        <CurrencyChart base={baseCurrency} target={targetCurrency} /> : 
                        <CurrencyGrid base={baseCurrency} target={targetCurrency} />
                    }
                </>
            )}
            <Footer />
        </div>
    );
}

export default App;



