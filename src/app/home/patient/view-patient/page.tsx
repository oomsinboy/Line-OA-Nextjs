"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PatientstateID from '@/components/patient/PatientStateid';
import axios from 'axios';
import { CallViewID } from '@/components/type';



function ViewPatient() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID[]>([]);

    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');

        if (paramState) {
            setState(paramState);
        }

        const fetchDataview = async () => {
            try {
                const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                // const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
                // setDataView(response.data);

                axios.get(`${apicall}visit/task/${paramId}`)
                    .then(res => {
                        setDataView(res.data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (paramId) {
            fetchDataview();
        }

    }, [searchParams]);


    console.log(dataView);
    

    return (
        <div className='min-h-screen'>
            <Navbar />
            {/* {dataView && <PatientstateID items={dataView} />} */}
            {/* {state === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : (
                <div>
                    
                </div>
            )} */}
            
        </div>
    )

}

export default ViewPatient;