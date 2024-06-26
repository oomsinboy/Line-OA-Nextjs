"use client"

import Navbar from '@/components/Navbar';
import React from 'react'
import { useSearchParams } from 'next/navigation'
import PatientstateID from '@/components/patient/PatientStateid';

function ViewPatient() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const state = searchParams.get('state')

    return (
        <div className='min-h-screen'>
            <Navbar />
            <PatientstateID id={patientId} state={state} />
        </div>
    )

}

export default ViewPatient;