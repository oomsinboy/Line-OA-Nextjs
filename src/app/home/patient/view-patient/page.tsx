"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState,useCallback } from 'react'
import { useSearchParams,useRouter } from 'next/navigation'
import axios from 'axios';
import { CallViewID } from '@/components/type';
import PatientstateID from '@/components/patient/PatientStateid';
import PreloadData, { PreloadWhite } from '@/components/patient/PreloadView';
import PatientRegis from '@/components/patient/PatientRegis';
import PatienComplete from '@/components/patient/PatienComplete';
import Cookies from 'js-cookie';

function ViewPatient() {
    const searchParams = useSearchParams();
    const [checkState, setCheckState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
      const user = Cookies.get('__user');
      if (!user) {
        router.push('/');
      }
    }, [router]);

    // useEffect(() => {
    //     const paramId = searchParams.get('id');

    //     const fetchDataview = async () => {
    //         try {
    //             const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
    //             const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
    //             setDataView(response.data);

    //             const patientState = response.data.patient?.state;
    //             if (typeof patientState === 'string') {
    //                 setCheckState(patientState);
    //             }

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     if (paramId) {
    //         fetchDataview();
    //     } else {
    //         setIsLoading(false);
    //     }

    // }, [searchParams]);

    const fetchDataview = useCallback(async () => {
        try {
            const paramId = searchParams.get('id');
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
    }, [searchParams]);
    
    useEffect(() => {
        const paramId = searchParams.get('id');
        if (paramId) {
            fetchDataview();
        } else {
            setIsLoading(false);
        }
    }, [searchParams, fetchDataview]); 

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <Navbar />
                {checkState === 'OTP' ? <PreloadData /> : <PreloadWhite />}
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <Navbar />
            {checkState === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : checkState === "Registered" ? (
                dataView && <PatientRegis items={dataView} fetchDataview={fetchDataview}/>
            ) : (
                dataView && <PatienComplete items={dataView} />
            )
            }

        </div>
    )

}

export default ViewPatient;