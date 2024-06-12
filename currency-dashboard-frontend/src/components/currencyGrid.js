import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function CurrencyGrid({ base, target }) {
    const [rowData, setRowData] = useState([]);
    const gridApi = useRef(null);

    const columnDefs = [
        { headerName: 'Base Currency', field: 'base_currency' },
        { headerName: 'Target Currency', field: 'target_currency' },
        { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter' },
        { headerName: 'Rate', field: 'rate', filter: 'agNumberColumnFilter' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:8000/api/get-rates/?base=${base}&target=${target}`);
            const data = await result.json();
            setRowData(data.data);
        };
        fetchData();
    }, [base, target]);

    const onGridReady = params => {
        gridApi.current = params.api;
        // Check local storage for saved filter model
        if (typeof window !== "undefined") {
            try {
                const gridSettingsKey = `gridSettings-${base}-${target}`;
                const storedSettings = localStorage.getItem(gridSettingsKey);
                if (storedSettings) {
                    const { filterModel } = JSON.parse(storedSettings);
                    params.api.setFilterModel(filterModel);
                }
            } catch (error) {
                console.error("Failed to access localStorage:", error);
            }
        }
    };

    const onFilterChanged = () => {
        if (gridApi.current && typeof window !== "undefined") {
            try {
                const filterModel = gridApi.current.getFilterModel();
                const gridSettingsKey = `gridSettings-${base}-${target}`;
                localStorage.setItem(gridSettingsKey, JSON.stringify({ filterModel }));
            } catch (error) {
                console.error("Failed to save filter settings to localStorage:", error);
            }
        }
    };

    return (
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
            <AgGridReact 
                columnDefs={columnDefs}
                rowData={rowData}
                onGridReady={onGridReady}
                onFilterChanged={onFilterChanged}
            />
        </div>
    );
}

export default CurrencyGrid;
