import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from './common';
import { Project } from './domain';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, skSK } from '@mui/x-data-grid';


interface ProjectAggregated {
    id: number,
    title: string,
    slug: string,
    country: string
    p98: number,
    p99: number,
    p100: number,
    p101: number,
    p102: number,
}

function aggregateSales(p: Project): ProjectAggregated {
    let ret : ProjectAggregated = {
        id: p.id,
        slug: p.slug,
        title: p.title,
        country: p.country,
        p98: p.shareSales.filter(ss => ss.share_price <= 0.98).map(ss => ss.shares_left).reduce((r, item) => r + item, 0),
        p99: p.shareSales.filter(ss => ss.share_price == 0.99).map(ss => ss.shares_left).reduce((r, item) => r + item, 0),
        p100: p.shareSales.filter(ss => ss.share_price == 1.00).map(ss => ss.shares_left).reduce((r, item) => r + item, 0),
        p101: p.shareSales.filter(ss => ss.share_price == 1.01).map(ss => ss.shares_left).reduce((r, item) => r + item, 0),
        p102: p.shareSales.filter(ss => ss.share_price >= 1.02).map(ss => ss.shares_left).reduce((r, item) => r + item, 0),
    }
    return ret;
}

const Application : React.FC = () => {

    const [projects, setProjects] = useState<ProjectAggregated[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [allCountries, setAllCountries] = useState<string[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(BASE_URL + `/data`).then(response => {
            setProjects(response.data.map((p: Project) => {
                return aggregateSales(p)
            }));
            let countries : string[] = [];
            for (let i = 0; i < response.data.length; i++) {
                if (!countries.includes(response.data[i].country)) {
                    countries.push(response.data[i].country);
                }
            }
            setSelectedCountries([...countries]);
            setAllCountries([...countries])
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setLoading(false);
        })
    }, []);

    if (loading || projects === undefined) {
        return <CircularProgress />
    }


    let columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Project', width: 450, renderCell: (params: any) => (
            <a href={`https://reinvest24.com/en/project/${params.row.slug}/${params.id}`}>
                {params.value}
            </a>
          ),
        },
        { field: 'p98', headerName: '<=0.98', width: 120 }, 
        { field: 'p99', headerName: '0.99', width: 120 },
        { field: 'p100', headerName: '1.0', width: 120 },
        { field: 'p101', headerName: '1.01', width: 120 },
        { field: 'p102', headerName: '>=1.02', width: 120 }
    ]

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <p>
                {allCountries.map(country => {
                    return (
                        <FormControlLabel control={<Checkbox checked={selectedCountries.includes(country)} onChange={(event: any) => {
                            let idx = selectedCountries.findIndex(c => c === country);
                            if (event.target.checked) {
                                if (idx < 0) {
                                    selectedCountries.push(country);
                                }
                            } else {
                                if (idx >= 0) {
                                    selectedCountries.splice(idx, 1);
                                }
                            }
                            setSelectedCountries([...selectedCountries]);
                        }} />} label={country} />
                    )
                })}
            </p>
            <DataGrid
                rows={projects.filter(p => selectedCountries.includes(p.country))}
                initialState={{
                    sorting: {
                      sortModel: [{ field: 'p99', sort: 'desc' }],
                    },
                }}
                columns={columns}
                pageSize={100}
                rowsPerPageOptions={[5]}
            />
        </div>
    )
}

export default Application;