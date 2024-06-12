import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function CurrencyChart({ base, target }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [timeRange, setTimeRange] = useState(7); // Default to last 7 days

    useEffect(() => {
        async function fetchData() {
            const apiUrl = `http://localhost:8000/api/get-rates/?base=${base}&target=${target}`;
            try{
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                filterData(result.data)
            }catch (error){
                console.error("Failed to fetch data:", error);
            }

        }

        fetchData();
    }, [base, target, timeRange]); // Dependency array to refetch data when base or target changes

    function filterData(data){
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);

        const filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        });

        const labels = filteredData.map(item => item.date);
        const rates = filteredData.map(item => item.rate);
        setChartData({
            labels,
            datasets: [
                {
                    label: `${base} to ${target} Exchange Rate`,
                    data: rates,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
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
            <Line data={chartData} />
        </div>
    );
}

export default CurrencyChart;
