'use client';

import Navbar from '@/components/Navbar'
import NotiBody from '@/components/inforandnoti/NotiBody'
import { InfoData } from '@/components/type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const fetchInfo = async (setDataNoti: (data: InfoData[]) => void) => {
  try {
    const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
    const response = await axios.get(apicall + "notification");
    setDataNoti(response.data);
  } catch (error) { 
    console.error('Error fetching data:', error);
  }
};

function Notifications() {
  const [dataNoti, setDataNoti] = useState<InfoData[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchInfo = async () => {
  //     try{
  //       const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
  //       const response = await axios.get(apicall + "notification");
  //       setDataNoti(response.data);
  //     } catch (error) { 
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  //   fetchInfo()
  // }, []);

  useEffect(() => {
    const user = Cookies.get('__user');
    if (!user) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    fetchInfo(setDataNoti);
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <NotiBody items={dataNoti} onFetchInfo={() => fetchInfo(setDataNoti)}/>
    </div>
  )
}

export default Notifications

