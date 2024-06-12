import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function CurrencyChart({ base, target }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [timeRange, setTimeRange] = useState(7); // Default to last 7 days
    const [secondTargetCurrency, setSecondTargetCurrency] = useState(''); // Second target currency

    useEffect(() => {
        fetchData(target, 'firstDataset'); // Fetch data for the first target currency
        if (secondTargetCurrency) {
            fetchData(secondTargetCurrency, 'secondDataset'); // Fetch data for the second target currency
        }
    }, [base, target, secondTargetCurrency, timeRange]); // Dependencies include both target currencies

    async function fetchData(target, datasetKey) {
        const apiUrl = `http://localhost:8000/api/get-rates/?base=${base}&target=${target}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            const filteredData = filterData(result.data);
            updateChartData(filteredData, target, datasetKey);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }

    function filterData(data){
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);
        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        });
    }

    function updateChartData(filteredData, target, datasetKey) {
        const labels = filteredData.map(item => item.date);
        const rates = filteredData.map(item => item.rate);
        const newDataset = {
            label: `${base} to ${target} Exchange Rate`,
            data: rates,
            fill: false,
            borderColor: datasetKey === 'firstDataset' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
            tension: 0.1
        };

        setChartData(prevData => {
            // Ensure labels are uniform across all datasets
            const allLabels = (prevData.labels.length > labels.length) ? prevData.labels : labels;
            return {
                labels: allLabels,
                datasets: [...prevData.datasets.filter(d => d.label !== newDataset.label), newDataset]
            };
        });
    }

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <select value={timeRange} onChange={e => setTimeRange(Number(e.target.value))}>
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={365}>Last 365 Days</option>
                <option value={730}>Last 730 Days</option>
            </select>
            <select value={secondTargetCurrency} onChange={e => setSecondTargetCurrency(e.target.value)}>
                <option value="">Add Secondary Currency</option>
                    {["EUR", "USD", "CAD"].filter(c => c !== target && c !== base).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
            </select>
            <Line data={chartData} />
        </div>
    );
}

export default CurrencyChart;
