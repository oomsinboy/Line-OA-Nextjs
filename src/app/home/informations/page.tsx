'use client';

import Navbar from '@/components/Navbar'
import InfoBody from '@/components/inforandnoti/InfoBody';
import { InfoData } from '@/components/type';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Informations() {
  const [dataInformations, setDataInformations] = useState<InfoData[]>([]);

  useEffect(() => {
    const fetchInfo = () => {
      const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
      axios.get(apicall + "information")
        .then(res => {
          setDataInformations(res.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    fetchInfo()
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <InfoBody items={dataInformations} />
    </div>
  )
}

export default Informations
