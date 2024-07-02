'use client';

import Navbar from '@/components/Navbar'
import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FixPatient } from '@/components/type';
import PatientBody from '@/components/patient/PatientBody';
import { PreloadWhite } from '@/components/patient/PreloadView';

function PatientPage() {
  const [dataPatient, setDataPatient] = useState<FixPatient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchVisit = () => {
      const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
      axios.get(apicall + "visit/")
        .then(res => {
          setDataPatient(res.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    setIsLoading(false);

    fetchVisit()
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <PreloadWhite />
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      {dataPatient && <PatientBody items={dataPatient} />}
    </div>
  )
}

export default PatientPage
