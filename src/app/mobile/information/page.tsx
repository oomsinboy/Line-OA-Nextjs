"use client"

import InformationList from '@/components/mobile/information/InformationList';
import { InfoDataX } from '@/components/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const fetchInfo = async (setDataInformations: (data: InfoDataX[]) => void, setLoading: (loading: boolean) => void) => {
  try {
    const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
    const response = await axios.get(apicall + "information");
    setDataInformations(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

export interface inforList {
  id:number,
  header: string,
  image: string
}



const MobileInfomation = () => {
  const [dataInformations, setDataInformations] = useState<InfoDataX[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInfo(setDataInformations,setLoading);
    // setDataInformations(dataInfo);
  }, []);

  return (
    <div className='min-h-screen'>
      <div className='z-10 fixed top-0 left-0 right-0 py-2 bg-[#AF88FF] flex justify-center items-center h-12'>
        <div className='text-white text-center'>
          <span>เรื่องน่ารู้เกี่ยวกับการส่องกล้อง (Information)</span>
        </div>
      </div>
      <div className='pt-16'>
        {/* <InformationList items={dataInformations}/> */}
        {loading ? (
          <div className="flex flex-col space-y-4">
            {/* Skeleton for each item */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="relative m-4 bg-gray-300 rounded-[30px] overflow-hidden animate-pulse">
                <div className="relative w-full h-[220px] bg-gray-400"></div>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="p-4 absolute bottom-0 left-0 right-0">
                  <h2 className="text-white text-xl font-bold bg-gray-500 rounded-md h-6 w-3/4 mb-2"></h2>
                  <div className="flex justify-end items-end">
                    <div className="mt-2 bg-gray-500 rounded-2xl h-8 w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <InformationList items={dataInformations}/>
        )}
      </div>
    </div>
  )
}

export default MobileInfomation
