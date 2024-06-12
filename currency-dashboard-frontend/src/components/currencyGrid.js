import React, { useState , useEffect, useRef  } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';


function CurrencyGrid({ base, target }) {
    const [rowData, setRowData] = useState([]);

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



    return (
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
            <AgGridReact 
                columnDefs={columnDefs}
                rowData={rowData}
            />
        </div>
    );
}

export default CurrencyGrid;
