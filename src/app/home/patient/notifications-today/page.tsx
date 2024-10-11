'use client';

import Navbar from '@/components/Navbar'
import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationsPatient } from '@/components/type';
import { PreloadWhite } from '@/components/patient/PreloadView';
import Notificationtoday from '@/components/patient/Notificationtoday';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function NotiPatientPage() {
  const [dataPatient, setDataPatient] = useState<NotificationsPatient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
    
  useEffect(() => {
    const user = Cookies.get('__user');
    if (!user) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const fetchVisit = async () => {

      try {
        const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
        const response = await axios.get(apicall + "daily_noti/");
        setDataPatient(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

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
      {dataPatient && <Notificationtoday items={dataPatient} />}
    </div>
  )
}

export default NotiPatientPage
