"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PatientstateID from '@/components/patient/PatientStateid';
import axios from 'axios';
import { CallViewID } from '@/components/type';



function ViewPatient() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID[]>([]);

    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');

        if (paramState) {
            setState(paramState);
        }

        const fetchDataview = async () => {
            try {
                const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                // const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
                // setDataView(response.data);

                axios.get(`${apicall}visit/task/${paramId}`)
                    .then(res => {
                        setDataView(res.data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (paramId) {
            fetchDataview();
        }

    }, [searchParams]);


    console.log(dataView);
    

    return (
        <div className='min-h-screen'>
            <Navbar />
            {/* {dataView && <PatientstateID items={dataView} />} */}
            {/* {state === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : (
                <div>
                    
                </div>
            )} */}
            <div className='px-8'>
                <div className='h-full w-full rounded-[15px] bg-white p-5 flex justify-center'>
                    <div className='min-h-[81.71dvh] w-[70%] flex flex-col'>
                        <div>
                            <div className='text-2xl text-[#5955B3] font-semibold'>เพิ่มผู้ป่วยใหม่</div>
                        </div>
                        <form action="" className=" mt-2">
                            <div className='flex justify-between'>
                                <div className="w-1/2 pr-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>ชื่อ</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
                                                // value={dataView.patient.appointment_time}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>นามสกุล</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
                                                // value={lname}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className="w-1/2 pr-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow text-[#705396]"
                                                // value={idcard}
                                                maxLength={13}
                                                pattern="\d{13}"
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="date"
                                                className="grow text-[#705396]"
                                                // value={dob}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className="w-1/2 pr-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>วันที่ลงทะเบียน</span>
                                        <label className=" bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                className="grow pointer-events-none text-[#705396]"
                                                // value={register_time}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4">
                                    <div className='my-2'>
                                        <span className='text-[#705396]'>วันนัดหมาย</span>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <input
                                                type="datetime-local"
                                                className="grow text-[#705396]"
                                                // value={datetimeLocal}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='flex justify-between'>
                            <div className='my-2 w-1/2 pr-4'>
                                <div className='flex'>
                                    <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
                                </div>
                                <div className='rounded bg-[#E8DBF5] min-h-[49dvh] p-3'>
                                    {/* <span className='text-[#705396]'> รายการที่เลือก {med.length} รายการ</span> */}
                                    <div className='max-h-[45dvh] overflow-y-auto'>
                                        {/* {med.map((medication: any, index: number) => (
                                        <div key={index} className='flex justify-between pt-2'>
                                            <select
                                                className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                value={medication.medic}
                                            >
                                                <option value={medication.medic}>{medication.medic}</option>
                                            </select>
                                            <select
                                                className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                value={medication.val}
                                            >
                                                <option value={medication.val}>{medication.val} วัน</option>
                                            </select>
                                        </div>
                                    ))} */}
                                        {/* {med.map((medication: any, index: number) => (
                                            <div key={index} className='flex justify-between pt-2'>
                                                <select
                                                    className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                    defaultValue={medication.medic}
                                                    disabled
                                                >
                                                    <option value={medication.medic}>{medication.medic}</option>
                                                </select>
                                                <select
                                                    className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                    defaultValue={medication.val}
                                                    disabled
                                                >
                                                    <option value={medication.val}>{medication.val} วัน</option>
                                                </select>
                                            </div>
                                        ))} */}
                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2 pl-4 flex justify-center items-center">
                                <div className='text-center w-1/2'>
                                    <div className='text-[#461F78] text-3xl font-semibold my-2'>OTP</div>
                                    <div className='text-[#705396] my-2'>รหัสนี้ใช้สำหรับลงทะเบียนผู้ใช้งาน Line OA</div>
                                    <div className='p-10 bg-[#F8F5FB] my-2'>
                                        {/* <span className='text-[#7F57D0] text-4xl tracking-widest'>{otp}</span> */}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewPatient;