"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { CallViewID } from '@/components/type';
import PatientstateID from '@/components/patient/PatientStateid';
import PreloadData from '@/components/patient/PreloadView';
import Image from 'next/image';

function ViewPatient() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');

        if (paramState) {
            setState(paramState);
        }

        const fetchDataview = async () => {
            try {
                const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
                setDataView(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (paramId) {
            fetchDataview();
        } else {
            setIsLoading(false);
        }

    }, [searchParams]);

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <Navbar />
                {state === 'OTP' ? <PreloadData /> : <div>ssss</div>}
            </div>
        );
    }


    return (
        <div className='min-h-screen'>
            <Navbar />
            {state === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : (
                <div className='px-8'>
                    <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                        <div className='min-h-[81.71dvh] flex flex-col'>
                            <div className='flex justify-between'>
                                <div>
                                    <div className='text-2xl text-[#5955B3] font-semibold'>ลงทะเบียนผู้ป่วย</div>
                                </div>
                                <div className='flex'>
                                    <button className="relative text-white w-42 font-light bg-[#AF88FF] btn btn-active mx-4">
                                        <Image
                                            className='gap-2'
                                            src={`/image/icon_edit.png`}
                                            alt="logo"
                                            width={30}
                                            height={30}
                                        />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='border border-red-500 w-[60%]'>
                                    <form action="">
                                        <div className='flex justify-between'>
                                            <div className="w-1/2 pr-4">
                                                <div className='my-2'>
                                                    <span className='text-[#705396]'>ชื่อ</span>
                                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                        // value={firstname}
                                                        // onChange={(e) => setFirstname(e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="w-1/2 pl-4">
                                                <div className='my-2'>
                                                    <span className='text-[#705396] '>นามสกุล</span>
                                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                        // value={lastname}
                                                        // onChange={(e) => setLastname(e.target.value)}
                                                        />
                                                    </label>

                                                </div>
                                            </div>
                                            {/* <div className="w-[30%] pl-4">
                                                <div className='my-2'>
                                                    <span className='text-[#705396] '>นามสกุล</span>
                                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                        />
                                                    </label>
                                                    
                                                </div>
                                            </div> */}
                                        </div>
                                        {/* <div className='flex justify-between'>
                                            <div className="w-1/2 pr-4">
                                                <div className='my-2'>
                                                    <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            className="grow text-[#705396]"
                                                            // value={idCard}
                                                            // onChange={handleIdCardChange}
                                                            maxLength={13}
                                                            pattern="\d{13}"
                                                            title="กรุณากรอกตัวเลข 13 หลัก"
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
                                                            // value={birthDate}
                                                            // onChange={(e) => setBirthDate(e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div> */}
                                    </form>
                                </div>
                                <div className='border border-green-500 w-[40%]'>
                                    <div className='flex'>
                                        <div className="w-[77.278%] pl-8">
                                            <div className='my-2'>
                                                <span className='text-[#705396] '>นามสกุล</span>
                                                <label className="relative input input-bordered flex items-center gap-2 w-full">
                                                    <input
                                                        type="text"
                                                        className="grow text-[#705396]"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className='flex items-center pt-6'>
                                            <button className="relative text-white font-light bg-[#693092] btn btn-active mx-3">
                                                <Image
                                                    src={`/image/icon_refresh.png`}
                                                    alt="logo"
                                                    width={30}
                                                    height={30}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )

}

export default ViewPatient;