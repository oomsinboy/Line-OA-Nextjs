'use client';

import Navbar from '@/components/Navbar'
import InfoBody from '@/components/inforandnoti/InfoBody';
import { InfoData } from '@/components/type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const fetchInfo = async (setDataInformations: (data: InfoData[]) => void) => {
  try {
    const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
    const response = await axios.get(apicall + "information");
    setDataInformations(response.data);
  } catch (error) { 
    console.error('Error fetching data:', error);
  }
};



function Informations() {
  const [dataInformations, setDataInformations] = useState<InfoData[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchInfo = () => {
  //     const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
  //     axios.get(apicall + "information")
  //       .then(res => {
  //         setDataInformations(res.data);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching data:', error);
  //       });
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
    fetchInfo(setDataInformations);
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <InfoBody items={dataInformations} onFetchInfo={() => fetchInfo(setDataInformations)}/>
    </div>
  )
}

export default Informations
