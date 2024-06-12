import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';

const currencies = [
    { code: 'USD', name: 'United States', flag: 'https://flagcdn.com/us.svg' },
    { code: 'EUR', name: 'Euro', flag: 'https://flagcdn.com/eu.svg' },
    { code: 'CAD', name: 'Canada', flag: 'https://flagcdn.com/ca.svg' },
    { code: 'CNY', name: 'China', flag: 'https://flagcdn.com/cn.svg' },
    { code: 'JPY', name: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
    { code: 'AUD', name: 'Australia', flag: 'https://flagcdn.com/au.svg' }
];

const colors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)'
];

function CurrencyChart({ base, target }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [timeRange, setTimeRange] = useState(7); // Default to last 7 days
    const [targets, setTargets] = useState([target]); // Array to hold target currencies
    const [isOpenSecondTarget, setIsOpenSecondTarget] = useState(false);

    useEffect(() => {
        // Fetch data for all targets when the base, targets, or timeRange change
        fetchDataForTargets(targets);
    }, [base, targets, timeRange]);

    async function fetchDataForTargets(targetArray) {
        const fetchedData = await Promise.all(targetArray.map(t => fetchData(t)));
        generateChartData(fetchedData, targetArray);
    }

    async function fetchData(target) {
        const apiUrl = `http://localhost:8000/api/get-rates/?base=${base}&target=${target}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            return { target, data: filterData(result.data) };
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return { target, data: [] };
        }
    }

    function filterData(data) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);
        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure data is sorted by date
    }

    function generateChartData(fetchedData, targetArray) {
        const allLabels = fetchedData[0]?.data.map(item => item.date) || [];
        const datasets = fetchedData.map((fetched, index) => ({
            label: `${base} to ${fetched.target} Exchange Rate`,
            data: fetched.data.map(item => item.rate),
            fill: true,
            borderColor: colors[index % colors.length],
            tension: 0.1
        }));
        setChartData({ labels: allLabels, datasets });
    }

    const handleSecondTargetSelect = (currency) => {
        if (!targets.includes(currency.code)) {
            setTargets([...targets, currency.code]);
        }
        setIsOpenSecondTarget(false);
    };

    return (
        <div className="flex justify-center items-center px-4 py-8">
            <div className="ag-theme-quartz w-full max-w-screen-md p-4 rounded-lg shadow-lg bg-white" style={{ height: 500 }}>
                <div className="flex justify-between mb-4 space-x-4">
                    <select value={timeRange} onChange={e => setTimeRange(Number(e.target.value))} className="form-select block w-1/3 h-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={365}>Last 365 Days</option>
                        <option value={730}>Last 730 Days</option>
                    </select>
                    <div className="relative w-1/3">
                        <button
                            type="button"
                            onClick={() => setIsOpenSecondTarget(!isOpenSecondTarget)}
                            className="focus:ring hovcard rounded-full inline-block px-4 py-2 bg-white border border-gray-300 shadow-sm text-gray-700 text-sm"
                        >
                            {targets.length > 1 ? (
                                <>
                                    <img className="inline-block mr-2" src={currencies.find(currency => currency.code === targets[1])?.flag} alt={targets[1]} width="24" height="24" />
                                    {targets[1]} <span className="ml-2">▼</span>
                                </>
                            ) : (
                                'Add Secondary Currency'
                            )}
                        </button>
                        {isOpenSecondTarget && (
                            <ul className="dropdownoptions absolute rounded-lg overflow-auto max-h-48 p-2 bg-white shadow border border-gray-300 z-10">
                                {currencies.filter(currency => !targets.includes(currency.code) && currency.code !== base).map(currency => (
                                    <li
                                        key={currency.code}
                                        className="hover:ring cursor-pointer rounded-lg flex items-center p-2"
                                        onClick={() => handleSecondTargetSelect(currency)}
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
                </div>
                <Line className='bg-white' data={chartData} />
            </div>
        </div>
    );
}

export default CurrencyChart;
