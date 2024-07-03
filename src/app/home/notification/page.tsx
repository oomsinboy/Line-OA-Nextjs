'use client';

import Navbar from '@/components/Navbar'
import NotiBody from '@/components/inforandnoti/NotiBody'
import { InfoData } from '@/components/type';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Notifications() {
  const [dataNoti, setDataNoti] = useState<InfoData[]>([]);

  useEffect(() => {
    const fetchInfo = () => {
      const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
      axios.get(apicall + "notification")
        .then(res => {
          setDataNoti(res.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    fetchInfo()
  }, []);

  // console.log(dataNoti);
  return (
    <div className='min-h-screen'>
      <Navbar />
      <NotiBody items={dataNoti}/>
    </div>
  )
}

export default Notifications

