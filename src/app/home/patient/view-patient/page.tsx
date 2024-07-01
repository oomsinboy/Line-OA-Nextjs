"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { CallViewID } from '@/components/type';
import PatientstateID from '@/components/patient/PatientStateid';
import PreloadData, { PreloadWhite } from '@/components/patient/PreloadView';
import Image from 'next/image';
import Calendar from '@/components/patient/Calendar';
import PatientRegis from '@/components/patient/PatientRegis';
import PatienComplete from '@/components/patient/PatienComplete';

function ViewPatient() {
    const searchParams = useSearchParams();
    const [checkState, setCheckState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');

        if (paramState) {
            setCheckState(paramState);
        }

        const fetchDataview = async () => {
            try {
                const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
                setDataView(response.data);

                const patientState = response.data.patient?.state;
                if (typeof patientState === 'string') {
                    setCheckState(patientState);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (paramId) {
            fetchDataview();
        } else {
            setIsLoading(false);
        }

    }, [searchParams]);

    // console.log(dataView.patient.state);


    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <Navbar />
                {checkState === 'OTP' ? <PreloadData /> : <PreloadWhite />}
            </div>
        );
    }

    console.log(checkState);

    return (
        <div className='min-h-screen'>
            <Navbar />
            {checkState === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : checkState === "Registered" ? (
                dataView && <PatientRegis items={dataView} />
            ) : (
                dataView && <PatienComplete items={dataView} />
            )
            }

        </div>
    )

}

export default ViewPatient;