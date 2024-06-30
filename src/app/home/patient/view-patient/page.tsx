"use client"

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { CallViewID } from '@/components/type';
import PatientstateID from '@/components/patient/PatientStateid';
import PreloadData, { PreloadWhite } from '@/components/patient/PreloadView';
import Image from 'next/image';
import Calendar from '@/components/patient/Calendar';
import PatientRegis from '@/components/patient/PatientRegis';

function ViewPatient() {
    const searchParams = useSearchParams();
    const [checkState, setCheckState] = useState<string>('');
    const [dataView, setDataView] = useState<CallViewID | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const paramId = searchParams.get('id');
        const paramState = searchParams.get('state');

        if (paramState) {
            setCheckState(paramState);
        }

        const fetchDataview = async () => {
            try {
                const apicall = process.env.NEXT_PUBLIC_CALLAPI as string;
                const response = await axios.get<CallViewID>(`${apicall}visit/task/${paramId}`);
                setDataView(response.data);

                const patientState = response.data.patient?.state;
                if (typeof patientState === 'string') {
                    setCheckState(patientState);
                }            

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

    // console.log(dataView.patient.state);
    

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <Navbar />
                {checkState === 'OTP' ? <PreloadData /> : <PreloadWhite/>}
            </div>
        );
    }


    return (
        <div className='min-h-screen'>
            <Navbar />
            {checkState === 'OTP' ? (
                dataView && <PatientstateID items={dataView} />
            ) : (
                dataView && <PatientRegis items={dataView}/>
                // <div className='px-8'>
                //     <div className='h-full w-full rounded-[15px] bg-white p-5 '>
                //         <div className='min-h-[81.71dvh] flex flex-col'>
                //             <div className='flex justify-between'>
                //                 <div>
                //                     <div className='text-2xl text-[#5955B3] font-semibold'>ลงทะเบียนผู้ป่วย</div>
                //                 </div>
                //                 <div className='flex'>
                //                     <button className="relative text-white w-42 font-light bg-[#AF88FF] btn btn-active mx-4">
                //                         <Image
                //                             className='gap-2'
                //                             src={`/image/icon_edit.png`}
                //                             alt="logo"
                //                             width={30}
                //                             height={30}
                //                         />
                //                         <span>Edit</span>
                //                     </button>
                //                 </div>
                //             </div>
                //             <div className='flex'>
                //                 <div className='border border-red-500 w-[55%]'>
                //                     <form action="">
                //                         <div className='flex justify-between'>
                //                             <div className="w-1/2 pr-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396]'>ชื่อ</span>
                //                                     <label className="input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="text"
                //                                             className="grow text-[#705396]"
                //                                         // value={firstname}
                //                                         // onChange={(e) => setFirstname(e.target.value)}
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                             <div className="w-1/2 pl-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396] '>นามสกุล</span>
                //                                     <label className="input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="text"
                //                                             className="grow text-[#705396]"
                //                                         // value={lastname}
                //                                         // onChange={(e) => setLastname(e.target.value)}
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                         </div>
                //                         <div className='flex justify-between'>
                //                             <div className="w-1/2 pr-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                //                                     <label className="input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="text"
                //                                             className="grow text-[#705396]"
                //                                             // value={idcard}
                //                                             maxLength={13}
                //                                             pattern="\d{13}"
                //                                             readOnly
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                             <div className="w-1/2 pl-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                //                                     <label className="input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="date"
                //                                             className="grow text-[#705396]"
                //                                         // value={dob}
                //                                         // readOnly
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                         </div>
                //                         <div className='flex justify-between'>
                //                             <div className="w-1/2 pr-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396]'>วันที่ลงทะเบียน</span>
                //                                     <label className=" bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="text"
                //                                             className="grow pointer-events-none text-[#705396]"
                //                                         // value={register_time}
                //                                         // readOnly
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                             <div className="w-1/2 pl-4">
                //                                 <div className='my-2'>
                //                                     <span className='text-[#705396]'>วันนัดหมาย</span>
                //                                     <label className="input input-bordered flex items-center gap-2 w-full">
                //                                         <input
                //                                             type="datetime-local"
                //                                             className="grow text-[#705396]"
                //                                         // value={datetimeLocal}
                //                                         // readOnly
                //                                         />
                //                                     </label>
                //                                 </div>
                //                             </div>
                //                         </div>
                //                     </form>
                //                     <div className='my-2 w-1/2 pr-4'>
                //                         <div className='flex'>
                //                             <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
                //                         </div>
                //                         <div className='rounded bg-[#E8DBF5] min-h-[48dvh] p-3'>
                //                             {/* <span className='text-[#705396]'> รายการที่เลือก {med.length} รายการ</span> */}
                //                             <div className='max-h-[45dvh] overflow-y-auto'>
                //                                 {/* {med.map((medication: any, index: number) => (
                //                                     <div key={index} className='flex justify-between pt-2'>
                //                                         <select
                //                                             className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                //                                             defaultValue={medication.medic}
                //                                             disabled
                //                                         >
                //                                             <option value={medication.medic}>{medication.medic}</option>
                //                                         </select>
                //                                         <select
                //                                             className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                //                                             defaultValue={medication.val}
                //                                             disabled
                //                                         >
                //                                             <option value={medication.val}>{medication.val} วัน</option>
                //                                         </select>
                //                                     </div>
                //                                 ))} */}
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </div>
                //                 <div className='border border-green-500 w-[45%]'>
                //                     <div className='flex pl-8'>
                //                         <div className="w-[63.016%] ">
                //                             <div className='my-2'>
                //                                 <span className='text-[#705396] '>นามสกุล</span>
                //                                 <label className="relative input input-bordered flex items-center gap-2 w-full">
                //                                     <input
                //                                         type="text"
                //                                         className="grow text-[#705396]"
                //                                     />
                //                                 </label>
                //                             </div>
                //                         </div>
                //                         <div className='flex items-center pt-6'>
                //                             <button className="relative text-white font-light bg-[#693092] btn btn-active mx-3">
                //                                 <Image
                //                                     src={`/image/icon_refresh.png`}
                //                                     alt="logo"
                //                                     width={30}
                //                                     height={30}
                //                                 />
                //                             </button>
                //                         </div>
                //                     </div>
                //                     <Calendar/>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </div>
            )}

        </div>
    )

}

export default ViewPatient;