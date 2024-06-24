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

  // PatientData
  return (
    <div className='min-h-screen'>
      <Navbar />
      <PatientBody items={dataPatient} />
      {/* <div className='px-8'>
        <div className='h-full w-full rounded-[15px] bg-white p-5 '>
          <div className='min-h-[81.71dvh] flex flex-col'>
            <div className='flex justify-between'>
              <div>
                <div className='text-2xl text-[#5955B3] font-semibold'>รายการผู้ป่วย</div>
                <div className='text-[#705396]'>ทั้งหมด {dataPatient.length} รายการ</div>
              </div>
              <div>
                <button className="relative text-white w-42 font-light bg-[#AF88FF] btn btn-active mx-4">
                  <span>Notifications Today</span>
                  <div className='absolute top-0 right-0 translate-x-[40%] -translate-y-[40%] text-white rounded-full bg-red-500 w-6 h-6 flex items-center justify-center'>
                    0
                  </div>
                </button>
                <button className="relative text-white w-40 font-light bg-[#AF88FF] btn btn-active">
                  <Image
                    className='absolute left-4'
                    src={`/icon_plus.png`}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                  Add New</button>
              </div>
            </div>
            <div className='pt-4'>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>วันที่ลงทะเบียน</th>
                      <th>วันนัดหมายตามกำหนด</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>สถานะ</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr>
                      <th>1</th>
                      <td>Cy Ganderton</td>
                      <td>Quality Control Specialist</td>
                      <td>Blue</td>
                      <td>Action</td>
                    </tr>

                    <tr>
                      <th>2</th>
                      <td>Hart Hagerty</td>
                      <td>Desktop Support Technician</td>
                      <td>Purple</td>
                      <td>Action</td>
                    </tr>

                    <tr>
                      <th>3</th>
                      <td>Brice Swyre</td>
                      <td>Tax Accountant</td>
                      <td>Red</td>
                      <td>Action</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default PatientPage
