'use client';

import Navbar from '@/components/Navbar'
import React from 'react'
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PatientData } from '@/components/type';
import PatientBody from '@/components/patient/PatientBody';

function PatientPage() {
  const [dataPatient, setDataPatient] = useState<PatientData[]>([]);

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

    fetchVisit()
  }, []);

  console.log(dataPatient);
  

  return (
    <div className='min-h-screen'>
      <Navbar />
      <PatientBody items={dataPatient} />
    </div>
  )
}

export default PatientPage
