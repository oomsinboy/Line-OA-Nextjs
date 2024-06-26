"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PatientstateID from '@/components/patient/PatientStateid';

function ViewPatient() {
    const searchParams = useSearchParams();
    const [id, setId] = useState<number>(0);
    const [state, setState] = useState<string>('');

    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');
        
        // แปลงค่า id และตรวจสอบให้แน่ใจว่าไม่ใช่ null
        if (paramId) {
            setId(parseInt(paramId));
        }
        if (paramState) {
            setState(paramState);
        }
    }, [searchParams]);

    return (
        <div className='min-h-screen'>
            <Navbar />
            <PatientstateID id={id} state={state} />
        </div>
    )

}

export default ViewPatient;